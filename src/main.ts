import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";
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
app.use(router);
app.use(pinia);

app
  .mount("#app")
  .$nextTick(() => postMessage({ payload: "removeLoading" }, "*"));
