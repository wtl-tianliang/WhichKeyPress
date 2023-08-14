<template>
  <div class="code" :style="config">{{ code.join("+") }}</div>
</template>

<script lang="ts" setup>
import { useConfig } from "../stores/config";

export interface Props {
  code: string[];
}

withDefaults(defineProps<Props>(), {
  code: () => [],
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
</style>
