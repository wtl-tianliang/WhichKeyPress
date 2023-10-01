<template>
  <div class="home-page">
    <HistoryPanel class="history-renderer" :list="histories" />
    <KeysPanel class="code-renderer" :code="code" :combo="combo" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import KeysPanel from "../components/KeysPanel.vue";
import HistoryPanel from "../components/HistoryPanel.vue";
import keyMap from "../assets/keycode";
import { useConfig } from "../stores/config";
import { useRecoder } from "../components/HistoryRecoder";

const code = ref<string[]>([]);
const combo = ref(0);
const i18n = useI18n();

const histories = useRecoder(code)

const { sync } = useConfig();

function getKeyName(keyCode: string): string {
  const map = keyMap as { [key: string]: string };
  return map[keyCode] || "";
}

// 1. HomePage and SettingPage are not in the same config-store, so the 'sync' function needs to be invoked.
// 2. if user chage language, need change i18n's locale.
window.EApi.onSyncConfig(async () => {
  const data = await sync();
  i18n.locale.value = data.language;
});

window.EApi.onKeydown((keyCode: string) => {
  keyCode = getKeyName(keyCode);
  const previousKey = code.value[code.value.length - 1];
  if (previousKey === keyCode) {
    combo.value += 1;
    return;
  }
  combo.value = 0;
  code.value.push(keyCode);
});

window.EApi.onKeyup((keyCode: string) => {
  combo.value = 0;
  keyCode = getKeyName(keyCode);
  code.value = code.value.filter((code) => code !== keyCode);
});
</script>

<style lang="scss" scoped>
.home-page {
  height: 100vh;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: column;
  .history-renderer {
    flex: 1;
    height: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 6px 6px 0 0;
  }
  .code-renderer {
    height: 50px;
    border-radius: 0 0 6px 6px;
  }
}
</style>
