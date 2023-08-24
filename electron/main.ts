import { app, BrowserWindow, ipcMain, screen } from "electron";
import { net, protocol } from "electron";
import path from "node:path";
import { pathToFileURL } from "url";
import { createTray } from "./tray";
import { initStore } from "./store";

const {
  keyDownHandler,
  keyUpHandler,
} = require("../native/node-native-win-utils.node");

process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.bounds;
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, "icon.png"),
    frame: false,
    transparent: true,
    maxHeight: screenHeight / 2,
    maxWidth: screenWidth / 2,
    minWidth: 200,
    minHeight: 80,
    height: 80,
    width: screenWidth / 4,
    x: 20,
    y: screenHeight - 150,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setAlwaysOnTop(true, "status", 1);

  const syncConfigToFrame = (_: Electron.IpcMainEvent) => {
    win!.webContents.send("syncConfigToFrame");
  };
  ipcMain.on("syncConfigToFrame", syncConfigToFrame);

  win.once("close", () => {
    ipcMain.off("syncConfigToFrame", syncConfigToFrame);
  });

  // https://github.com/electron/electron/issues/24893#issuecomment-1109262719
  win.hookWindowMessage(0x0116, () => {
    win!.setEnabled(false);
    win!.setEnabled(true);
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile(path.join(process.env.DIST, "index.html"));
    win.loadURL(`whichkey://wk.oddtools.cn/`);
  }

  return win;
}

function bindKeyEvent(win: BrowserWindow) {
  keyDownHandler((keyCode: string) => {
    console.log("Key down:", keyCode);
    win.webContents.send("keydown", keyCode);
  });
  keyUpHandler((keyCode: string) => {
    console.log("Key up:", keyCode);
    win.webContents.send("keyup", keyCode);
  });
}

app.on("window-all-closed", () => {
  win = null;
});

function registerProtocol(): void {
  protocol.handle("whichkey", (req) => {
    const { pathname } = new URL(req.url);
    if (pathname === "/") {
      const _temp = path.join(process.env.DIST, "index.html");
      const _path = pathToFileURL(_temp).toString();
      return net.fetch(_path);
    }
    const _temp = path.join(process.env.DIST, pathname);
    const _path = pathToFileURL(_temp).toString();
    return net.fetch(_path);
  });
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: "whichkey",
    privileges: { bypassCSP: true, standard: true, secure: true },
  },
]);

app.whenReady().then(() => {
  registerProtocol();
  initStore();
  const win = createWindow();
  bindKeyEvent(win);
  createTray(app, win);
});
