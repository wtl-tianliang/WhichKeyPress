<template>
  <div class="setting-page">
    <div class="preview">
      <key-panel :code="['Control', 'C']"></key-panel>
    </div>

    <!-- Setting config -->
    <el-form
      class="setting-form"
      :model="config"
      size="small"
      label-width="120"
      label-position="left"
    >
      <!-- fontSize -->
      <el-form-item label="FontFamily">
        <el-select v-model="config.fontFamily">
          <template v-for="font in fontOptions">
            <el-option :label="font" :value="font">{{ font }}</el-option>
          </template>
        </el-select>
      </el-form-item>

      <!-- fontSize -->
      <el-form-item label="FontSize">
        <el-select v-model="config.fontSize">
          <template v-for="i in fontSizeOptions">
            <el-option :label="i" :value="`${i}px`">{{ i }}</el-option>
          </template>
        </el-select>
      </el-form-item>

      <!-- fontColor -->
      <el-form-item label="FontColor">
        <el-color-picker v-model="config.color" show-alpha />
      </el-form-item>

      <!-- backgroundColor -->
      <el-form-item label="BackgroundColor">
        <el-color-picker v-model="config.backgroundColor" show-alpha />
      </el-form-item>

      <!-- submit -->
      <el-button
        class="save-btn"
        type="primary"
        size="default"
        @click="handleConfirm"
        >Save</el-button
      >
      <el-link link type="info" @click="handleToDefault"
        >Reset to default</el-link
      >
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElButton, ElLink } from "element-plus";
import { ElColorPicker, ElSelect, ElOption } from "element-plus";
import KeyPanel from "../components/KeysPanel.vue";
import { useConfig } from "../stores/config";
import { ref } from "vue";

const store = useConfig();
const { config, reset } = store;
const fontOptions = ref<string[]>([]);
const fontSizeOptions = ref<number[]>([]);

for (let i = 10; i < 80; i += 5) {
  fontSizeOptions.value.push(i);
}

window.EApi.onLoadFontFamily((fonts) => {
  fontOptions.value = fonts;
});

function handleConfirm() {
  const data = JSON.stringify(config);
  localStorage.setItem("config", data);
  window.EApi.syncConfig();
}
function handleToDefault() {
  reset();
}
</script>

<style lang="scss" scoped>
.setting-page {
  height: 100vh;
  box-sizing: border-box;
  background-color: #fff;
  overflow: auto;
}
.preview {
  padding: 10px 10px 0 10px;
}
.setting-form {
  margin: 10px 0;
  padding: 10px;
}
.save-btn {
  display: block;
  width: 100%;
}
</style>
