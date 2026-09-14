import { app, BrowserWindow, desktopCapturer, dialog, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";

import { fileURLToPath } from "node:url";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import path from "node:path";

app.disableHardwareAcceleration();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let studio: BrowserWindow | null;
let floatingWebCam: BrowserWindow | null;
let rendererServer: Server | null = null;

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getRendererFilePath(requestUrl = "/") {
  const url = new URL(requestUrl, APP_URL);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = path.resolve(RENDERER_DIST, `.${requestedPath}`);
  const rendererRoot = path.resolve(RENDERER_DIST);

  if (
    resolvedPath !== rendererRoot &&
    !resolvedPath.startsWith(`${rendererRoot}${path.sep}`)
  ) {
    return null;
  }

  return resolvedPath;
}

async function serveRendererFile(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }

  let filePath = getRendererFilePath(request.url);

  try {
    if (!filePath) {
      response.writeHead(403).end();
      return;
    }

    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      response.writeHead(404).end();
      return;
    }
  } catch {
    const requestPath = new URL(request.url || "/", APP_URL).pathname;
    const shouldServeAppShell = path.extname(requestPath) === "";

    if (!shouldServeAppShell) {
      response.writeHead(404).end();
      return;
    }

    filePath = path.join(RENDERER_DIST, "index.html");
  }

  const contentType =
    MIME_TYPES[path.extname(filePath).toLowerCase()] ||
    "application/octet-stream";

  response.writeHead(200, { "Content-Type": contentType });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

function startRendererServer() {
  if (rendererServer) {
    return Promise.resolve(APP_URL);
  }

  const appUrl = new URL(APP_URL);
  if (appUrl.protocol !== "http:") {
    return Promise.reject(
      new Error(
        "VITE_APP_URL must use http:// for the packaged renderer server",
      ),
    );
  }

  const port = Number(appUrl.port || "80");

  return new Promise<string>((resolve, reject) => {
    const server = createServer(serveRendererFile);

    server.once("error", reject);
    server.listen(port, appUrl.hostname, () => {
      server.off("error", reject);
      rendererServer = server;
      resolve(appUrl.origin);
    });
  });
}

function getRendererUrl(baseUrl: string, fileName?: string) {
  if (!fileName) {
    return baseUrl;
  }

  return new URL(
    fileName,
    baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
  ).toString();
}

async function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 400,
    minHeight: 100,
    minWidth: 300,
    hasShadow: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "vync-logof.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  studio = new BrowserWindow({
    width: 400,
    // height: 200,
    minHeight: 70,
    // maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  floatingWebCam = new BrowserWindow({
    width: 200,
    height: 200,
    minHeight: 20,
    maxHeight: 200,
    minWidth: 200,
    maxWidth: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);
  floatingWebCam.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  floatingWebCam.setAlwaysOnTop(true, "screen-saver", 1);
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  studio.webContents.on("did-finish-load", () => {
    studio?.webContents.send(
      "main-process-message",
      new Date().toLocaleString(),
    );
  });

  const rendererUrl = VITE_DEV_SERVER_URL || (await startRendererServer());

  win.loadURL(rendererUrl);
  studio.loadURL(getRendererUrl(rendererUrl, "studio.html"));
  floatingWebCam.loadURL(getRendererUrl(rendererUrl, "webcam.html"));
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

app.on("before-quit", () => {
  rendererServer?.close();
  rendererServer = null;
});

ipcMain.on("closeApp", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

ipcMain.handle("getSources", async () => {
  const data = await desktopCapturer.getSources({
    thumbnailSize: { height: 100, width: 150 },
    fetchWindowIcons: true,
    types: ["window", "screen"],
  });
  return data;
});
ipcMain.on("media-sources", (event, payload) => {
  console.log(event);
  studio?.webContents.send("profile-received", payload);
});
ipcMain.on("resize-studio", (event, payload) => {
  console.log(event);
  if (payload.shrink) {
    studio?.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio?.setSize(400, 250);
  }
});
ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event);
  win?.webContents.send("hide-plugin", payload);
});
app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
autoUpdater.on("update-available", (info) => {
  dialog.showMessageBox({
    type: "info",
    title: "Update Available",
    message: `Vync ${info.version} is available. Downloading...`,
  });
});

autoUpdater.on("update-downloaded", () => {
  dialog.showMessageBox({
    type: "info",
    title: "Update Ready",
    message: "A new version has been downloaded.",
    buttons: ["Restart Now", "Later"],
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

app.whenReady().then(async () => {
  await createWindow();

  autoUpdater.checkForUpdatesAndNotify();
});
