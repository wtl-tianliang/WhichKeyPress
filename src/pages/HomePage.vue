<template>
  <div class="home-page">
    <KeysPanel :code="code" :combo="combo" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import KeysPanel from "../components/KeysPanel.vue";
import keyMap from "../assets/keycode";
import { useConfig } from "../stores/config";

const code = ref<string[]>([]);
const combo = ref(0);
const i18n = useI18n();

const { sync } = useConfig();

function getKeyName(keyCode: string): string {
  const map = keyMap as { [key: string]: string };
  return map[keyCode] || "";
}

// 1. HomePage and SettingPage are not in the same config-store, so the 'sync' function needs to be invoked.
// 2. if user chage language, need change i18n's locale.
window.EApi.onSyncConfig(() => {
  const data = sync();
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

<style scoped>
.home-page {
  height: 100vh;
  -webkit-app-region: drag;
}
</style>
