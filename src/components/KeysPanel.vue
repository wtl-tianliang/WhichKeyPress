<template>
  <div class="code" :style="config">
    <span>{{ code.join("+") }}</span>
    <span
      v-show="config.enableCombo && combo > 0"
      class="combo"
      :style="{ '--size': config.fontSize }"
      >x{{ combo }}</span
    >
  </div>
</template>

<script lang="ts" setup>
import { useConfig } from "../stores/config";

export interface Props {
  code: string[];
  combo?: number;
}

withDefaults(defineProps<Props>(), {
  code: () => [],
  combo: 0,
});

const { config } = useConfig();
</script>

<style scoped>
.code {
  height: 100%;
  border-radius: 6px;
  user-select: none;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}
.combo {
  position: relative;
  left: 10px;
  top: 4px;
  font-size: calc(var(--size) * 0.8);
}
</style>
