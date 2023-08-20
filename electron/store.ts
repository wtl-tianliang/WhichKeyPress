import { app, ipcMain, type IpcMainInvokeEvent } from "electron";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { ConfigState } from "../src/stores/config";

function getPath(): string {
  const dir = join(app.getPath("appData"), "WhichKeyPress");
  let path = join(dir, "config.json");
  if (!existsSync(dir)) {
    mkdirSync(dir);
    writeFileSync(path, "");
  }
  return path;
}

export function saveConfig(config: string): Promise<void> {
  const path = getPath();
  return new Promise((resolve) => {
    if (!config) {
      config = "{}";
    }
    writeFileSync(path, config, { encoding: "utf-8" });
    resolve();
  });
}

export function loadConfig(): Promise<ConfigState> {
  const path = getPath();
  if (!existsSync(path)) {
    saveConfig("");
  }
  return new Promise((resolve) => {
    const str = readFileSync(path, { encoding: "utf-8" });
    const data = JSON.parse(str) as unknown as ConfigState;
    resolve(data);
  });
}

export function initStore() {
  ipcMain.handle("loadConfig", (_event: IpcMainInvokeEvent) => {
    return loadConfig();
  });
  ipcMain.handle("saveConfig", (_event: IpcMainInvokeEvent, data: string) => {
    return saveConfig(data);
  });
}
