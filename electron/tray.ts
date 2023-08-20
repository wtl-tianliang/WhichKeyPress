import { Tray, Menu, type BrowserWindow, App } from "electron";
import { resolvePath, loadLanguage } from "./utils";
import { createSettingWindow } from "./setting";
import { productName } from "../package.json";

export function createTray(app: App, _win: BrowserWindow) {
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
