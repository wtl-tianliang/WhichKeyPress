import { app, BrowserWindow, ipcMain, Menu, screen, Tray } from "electron";
import { net, protocol } from "electron";
import path from "node:path";
import { pathToFileURL } from "url";
import { productName } from "../package.json";
import { createSettingWindow } from "./setting";

const {
  keyDownHandler,
  keyUpHandler,
} = require("../native/node-native-win-utils.node");

process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

function resolvePath(_path: string): string {
  return path.join(process.env.DIST, _path);
}

function loadLanguage(name: string) {
  return import(`../locales/${name}.json`).catch(() => {
    return import("../locales/en_US.json");
  });
}
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
    alwaysOnTop: true,
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

  const syncConfig = (_: Electron.IpcMainEvent) => {
    win!.webContents.send("syncConfig");
  };
  ipcMain.on("syncConfig", syncConfig);

  win.once("close", () => {
    ipcMain.off("syncConfig", syncConfig);
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

function createTray(_win: BrowserWindow) {
  const tray = new Tray(resolvePath("../public/icon.png"));

  async function getContextMenu() {
    const visible = _win.isVisible();

    // load system language setting as default language.
    const [mainlang, sublang] = app.getLocale().split("-");
    const langName = sublang ? `${mainlang}_${sublang}` : mainlang;
    const { default: lang } = await loadLanguage(langName);
    const contextMenus = Menu.buildFromTemplate([
      {
        id: "visible",
        label: visible ? lang.context.hide : lang.context.show,
        click: () => {
          if (visible) {
            _win.hide();
          } else {
            _win.show();
          }
        },
      },
      {
        id: "setting",
        label: lang.context.setting,
        click: () => {
          createSettingWindow();
        },
      },
      {
        id: "exit",
        label: lang.context.exit,
        click: () => {
          app.quit();
        },
      },
    ]);
    return contextMenus;
  }

  tray.on("right-click", () => {
    getContextMenu().then((menu) => {
      tray.popUpContextMenu(menu);
    });
  });
  tray.setToolTip(`${productName}`);
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
  const win = createWindow();
  bindKeyEvent(win);
  createTray(win);
});
