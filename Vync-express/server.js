const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const fs = require("fs");
const http = require("http");
const dotenv = require("dotenv");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

// Crash early if the secret is missing so you don't find out the hard way
if (!process.env.INTERNAL_SERVER_SECRET) {
  console.error("🔴 FATAL ERROR: INTERNAL_SERVER_SECRET is missing from .env");
  process.exit(1);
}

const app = express();
app.use(
  cors({
    origin: [
      "https://vync-157i.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);

const server = http.createServer(app);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize the Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const uploadDir = path.join(__dirname, "temp_upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🟢 FIX #2 APPLIED: Stream map is now global to handle user disconnects/reconnects
const activeUploadStreams = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
  socket.emit("connected");

  socket.on("video-chunks", (data) => {
    try {
      const filePath = path.join(uploadDir, data.filename);
      const chunkBuffer = Buffer.from(data.chunks);

      let writeStream = activeUploadStreams.get(data.filename);

      if (!writeStream) {
        writeStream = fs.createWriteStream(filePath, { flags: "a" });
        activeUploadStreams.set(data.filename, writeStream);

        writeStream.on("error", (err) => {
          console.error("🔴 Stream error:", err);
          activeUploadStreams.delete(data.filename);
        });
      }

      // This guarantees chronological order!
      writeStream.write(chunkBuffer, (err) => {
        if (err) {
          console.error("🔴 Error writing chunk:", err);
          socket.emit("upload-error", { message: "Failed to save chunk" });
        }
      });
    } catch (error) {
      console.error("🔴 Error processing video chunk:", error);
      socket.emit("upload-error", { message: "Failed to process chunk" });
    }
  });

  socket.on("process-video", async (data) => {
    const filePath = path.join(uploadDir, data.filename);

    try {
      console.log("🟢 Processing video:", data.filename);

      // 🟢 FIX #1 APPLIED: Securely close the write stream before reading
      const writeStream = activeUploadStreams.get(data.filename);
      if (writeStream) {
        await new Promise((resolve) => {
          writeStream.end(resolve);
        });
        activeUploadStreams.delete(data.filename); // Clean up memory map
      }

      if (!fs.existsSync(filePath)) {
        throw new Error("Video file not found");
      }

      // Send the secret token to Next.js
      const processing = await axios.post(
        `${process.env.NEXT_API_HOST}/api/recording/${data.userId}/processing`,
        { filename: data.filename },
        {
          headers: {
            Authorization: `Bearer ${process.env.INTERNAL_SERVER_SECRET}`,
          },
        },
      );

      if (processing.data.status !== 200) {
        throw new Error("Failed to create processing file");
      }

      // Upload to Cloudinary
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "vync",
              public_id: data.filename,
              chunk_size: 6000000, // 🟢 ADDED: Cloudinary chunking for large files!
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          fs.createReadStream(filePath).pipe(uploadStream);
        });
      };

      const uploadResult = await uploadToCloudinary();
      console.log("🟢 Video uploaded to Cloudinary:", uploadResult.secure_url);

      // Handle AI functionality for PRO users
      // Handle AI functionality for PRO users
      if (processing.data.plan === "PRO") {
        try {
          console.log("🟢 Started Gemini AI Analysis...");

          const uploadedFile = await ai.files.upload({
            file: filePath,
            config: { mimeType: "video/webm" },
          });

          let fileStatus = await ai.files.get({
            name: uploadedFile.name,
          });

          let retries = 0;

          while (fileStatus.state === "PROCESSING" && retries < 60) {
            retries++;

            console.log(`⏳ Gemini Processing... Attempt ${retries}`);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            fileStatus = await ai.files.get({
              name: uploadedFile.name,
            });
          }

          if (fileStatus.state === "FAILED") {
            throw new Error("Gemini failed to process uploaded file");
          }

          if (retries >= 60) {
            throw new Error("Gemini timeout");
          }

          const prompt = `
      Analyze this video.

      1. Transcribe spoken audio completely.
      2. Generate a short title.
      3. Generate a concise summary.

      Return ONLY valid JSON:

      {
        "transcript":"",
        "title":"",
        "summary":""
      }
    `;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                fileData: {
                  fileUri: uploadedFile.uri,
                  mimeType: uploadedFile.mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
            config: {
              responseMimeType: "application/json",
            },
          });

          console.log("🟢 Gemini Raw Response:", response.text);

          const aiData = JSON.parse(response.text);

          await axios.post(
            `${process.env.NEXT_API_HOST}/api/recording/${data.userId}/transcribe`,
            {
              filename: data.filename,
              content: JSON.stringify({
                title: aiData.title,
                summary: aiData.summary,
              }),
              transcript: aiData.transcript,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.INTERNAL_SERVER_SECRET}`,
              },
            },
          );

          await ai.files.delete({
            name: uploadedFile.name,
          });

          console.log("🟢 AI Processing Complete");
        } catch (geminiError) {
          console.error(
            "🔴 Gemini Failed:",
            geminiError.message || geminiError,
          );

          console.log("🟢 Continuing video upload without AI...");
        }
      }

      // Tell Next.js the upload/processing is complete
      const stopProcessing = await axios.post(
        `${process.env.NEXT_API_HOST}/api/recording/${data.userId}/complete`,
        {
          filename: data.filename,
          videoUrl: uploadResult.secure_url,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.INTERNAL_SERVER_SECRET}`,
          },
        },
      );

      if (stopProcessing.data.status !== 200) {
        throw new Error("Failed to complete processing");
      }
    } catch (error) {
      console.error(
        "🔴 Error processing video globally:",
        error.message || error,
      );
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("🔴 Error deleting file:", err);
          else console.log("🟢 Cleaned up local file:", data.filename);
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

process.on("unhandledRejection", (error) => {
  console.error("🔴 Unhandled Rejection:", error);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🟢 Server listening on port ${PORT}`);
});
