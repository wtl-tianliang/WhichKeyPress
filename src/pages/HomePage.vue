<template>
  <div class="home-page">
    <KeysPanel :code="code" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import KeysPanel from "../components/KeysPanel.vue";
import keyMap from "../assets/keycode";
import { useConfig } from "../stores/config";

const code = ref<string[]>([]);
const { sync } = useConfig();

function getKeyName(keyCode: string): string {
  const map = keyMap as { [key: string]: string };
  return map[keyCode] || "";
}

window.EApi.onSyncConfig(() => {
  sync();
});

window.EApi.onKeydown((keyCode: string) => {
  keyCode = getKeyName(keyCode);
  const previousKey = code.value[code.value.length - 1];
  if (previousKey === keyCode) {
    return;
  }
  code.value.push(keyCode);
});

window.EApi.onKeyup((keyCode: string) => {
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
