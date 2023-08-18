import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";
import i18n from "./i18n/index";
import "./style.scss";
import App from "./App.vue";

import Home from "./pages/HomePage.vue";
import Setting from "./pages/SettingPage.vue";

const pinia = createPinia();
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/setting", component: Setting },
  ],
});

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);

app
  .mount("#app")
  .$nextTick(() => postMessage({ payload: "removeLoading" }, "*"));
