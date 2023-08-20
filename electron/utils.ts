import path from "node:path";

export function resolvePath(_path: string): string {
  return path.join(process.env.DIST, _path);
}

export function loadLanguage(name: string) {
  return import(`../locales/${name}.json`).catch(() => {
    return import("../locales/en_US.json");
  });
}