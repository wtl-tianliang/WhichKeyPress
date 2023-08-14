import { defineStore } from "pinia";
import { reactive } from "vue";

export type ConfigState = {
  backgroundColor: string;
  fontFamily: string;
  color: string;
  fontSize: string;
};

export const useConfig = defineStore("config", () => {
  const defaultConfig: ConfigState = {
    fontFamily: "Arial",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "rgba(255, 255, 255, 1)",
    fontSize: "30px",
  };
  const config = reactive<ConfigState>({ ...defaultConfig });

  function sync() {
    const _data = localStorage.getItem("config") || "{}";
    const data = JSON.parse(_data) as ConfigState;
    Object.keys(data).forEach((key) => {
      // @ts-expect-error: key index
      config[key] = data[key];
    });
  }
  sync();

  function reset() {
    Object.keys(defaultConfig).forEach((key) => {
      // @ts-expect-error: key index
      config[key] = defaultConfig[key];
    });
  }

  return { config, sync, reset };
});
