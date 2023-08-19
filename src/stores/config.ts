import { defineStore } from "pinia";
import { reactive } from "vue";
import type { LanguageConfig } from "../i18n/index";

export type ConfigState = {
  backgroundColor: string;
  fontFamily: string;
  color: string;
  fontSize: string;
  language: keyof LanguageConfig;
  enableCombo: boolean;
};

/**
 * laod language setting in localStorage.
 * @returns string
 */
function getLocalConfig(): ConfigState {
  const _data = localStorage.getItem("config") || "{}";
  const data = JSON.parse(_data) as ConfigState;
  return data;
}

export const useConfig = defineStore("config", () => {
  // Load system language setting as default language.  e.g. en_US | zh_CN
  const [mainlang, sublang] = (navigator.language || "en-US").split("-");
  const locale = `${mainlang}_${sublang}`;

  const defaultConfig: ConfigState = {
    fontFamily: "Arial",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "rgba(255, 255, 255, 1)",
    fontSize: "30px",
    enableCombo: true,
    language: locale as unknown as keyof LanguageConfig,
  };

  const config = reactive<ConfigState>({ ...defaultConfig });

  function sync() {
    const data = getLocalConfig();
    Object.keys(data).forEach((key) => {
      // @ts-expect-error: key index
      config[key] = data[key];
    });
    return data;
  }
  sync();

  function reset() {
    Object.keys(defaultConfig).forEach((key) => {
      // @ts-expect-error: key index
      config[key] = defaultConfig[key];
    });
  }

  return { config, sync, reset, getLocalConfig };
});
