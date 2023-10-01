<template>
  <ul
    class="history-panel"
    ref="panel"
    :style="{ '--lineHeight': `${lineheight}px` }"
  >
    <li v-for="(li, index) in list" :key="index">{{ li.join("+") }}</li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useConfig } from "../stores/config";
import { debounce } from "lodash-es";
interface Props {
  list: Array<string[]>;
}

const panel = ref<Element | null>(null);
const ob = new MutationObserver(scrollToBottom);
const lineheight = ref<number>(1);
const { config } = useConfig();

const sizeObserverCallback = debounce(function _sizeObserverCallback(
  entries: ResizeObserverEntry[]
) {
  if (!panel.value) {
    return;
  }
  const [entry] = entries;
  const height = entry.contentRect.height;
  const fontLineHeight = Math.max(parseInt(config.fontSize), 32);
  lineheight.value = height > 100 ? fontLineHeight : height;
  scrollToBottom();
},
200);
const sizeOb = new ResizeObserver(sizeObserverCallback);

function scrollToBottom() {
  if (!panel.value) {
    return;
  }
  panel.value.scrollTo({
    top: Number.MAX_SAFE_INTEGER,
    behavior: "smooth",
  });
}

onMounted(() => {
  nextTick(() => {
    if (!panel.value) {
      return;
    }
    ob.observe(panel.value, { childList: true });
    sizeOb.observe(panel.value);
  });
});
onBeforeUnmount(() => {
  ob.disconnect();
  sizeOb.disconnect();
});

withDefaults(defineProps<Props>(), {
  list: () => [],
});
</script>

<style lang="scss" scoped>
.history-panel {
  overflow: auto;
  height: 100%;
  li {
    padding: 0 10px;
    height: var(--lineHeight);
    line-height: var(--lineHeight);
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
