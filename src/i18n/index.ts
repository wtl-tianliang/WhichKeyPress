import { createI18n } from "vue-i18n";
import en_US from "../../locales/en_US.json";
import zh_CN from "../../locales/zh_CN.json";

export type Lang = typeof en_US;

export type LanguageConfig = {
  en_US: Lang;
  zh_CN: Lang;
};

const messages: LanguageConfig = {
  en_US,
  zh_CN,
};

/**
 * load language
 * 1. laod language in localStorage
 * 2. load language in system setting
 * @returns string
 */
function getLocale() {
  const _data = localStorage.getItem("config") || "{}";
  const data = JSON.parse(_data);
  const [mainlang, sublang] = (navigator.language || "en-US").split("-");
  const locale = data.language || `${mainlang}_${sublang}`;
  return locale;
}


const instance = createI18n<[Lang], keyof LanguageConfig>({
  locale: getLocale(),
  fallbackLocale: "en_US",
  legacy: false,
  messages,
});

export default instance;
