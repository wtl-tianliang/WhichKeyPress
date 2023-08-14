import { BrowserWindow } from "electron";
import path from "node:path";

const fontList = require("font-list");

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
let win: BrowserWindow | null = null;

function loadFontFamily(win: BrowserWindow) {
  // doc: https://github.com/oldj/node-font-list
  fontList.getFonts({ disableQuoting: true }).then((list: string[]) => {
    win.webContents.send("loadFontFamily", list);
  });
}

export function createSettingWindow(): BrowserWindow {
  if (win) {
    win.show();
    return win;
  }

  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, "icon.png"),
    frame: true,
    center: true,
    width: 500,
    height: 600,
    resizable: false,
    minimizable: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenu(null);

  win.once("ready-to-show", () => {
    loadFontFamily(win!);
  });
  win.once("closed", () => {
    win = null;
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(`${VITE_DEV_SERVER_URL}#/setting`);
    win.webContents.openDevTools();
  } else {
    // win.loadFile(path.join(process.env.DIST, "index.html"));
    win.loadURL(`whichkey://wk.oddtools.cn/#/setting`);
  }

  return win;
}
