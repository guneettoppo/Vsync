import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // 1. SECURITY CHECK: Ensure request is coming from your Express Server
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.INTERNAL_SERVER_SECRET}`) {
      console.error("🔴 Unauthorized attempt to access transcribe API");
      return NextResponse.json(
        { error: "Unauthorized Service" },
        { status: 401 },
      );
    }

    // 2. Parse incoming data from Express (Gemini AI output)
    const body = await req.json();
    const content = JSON.parse(body.content);

    // 3. Database Update
    const transcribed = await client.video.update({
      where: {
        userId: id,
        source: body.filename,
      },
      data: {
        title: content.title,
        description: content.summary,
        summery: body.transcript, // (Assuming 'summery' is how it's spelled in your Prisma Schema)
      },
    });

    if (transcribed) {
      console.log("🟢 Database successfully updated with AI Transcription");
      return NextResponse.json({
        status: 200,
        message: "Successfully transcribed and saved",
      });
    }

    // Fallback if Prisma returns null/undefined without throwing an error
    console.log("🔴 Transcription update failed (No record returned)");
    return NextResponse.json({ status: 400, error: "Failed to update record" });
  } catch (error) {
    // 4. ERROR HANDLING: Catch Prisma errors or JSON parsing errors safely
    console.error("🔴 Next.js Transcribe API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
