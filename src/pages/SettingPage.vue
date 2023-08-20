<template>
  <div class="setting-page">
    <div class="preview">
      <key-panel :code="['Control', 'C']" :combo="99"></key-panel>
    </div>

    <!-- Setting config -->
    <el-form
      class="setting-form"
      :model="config"
      size="small"
      label-width="120"
      label-position="left"
    >
      <!-- language -->
      <el-form-item :label="$t('setting.language')">
        <el-select v-model="config.language">
          <template v-for="lang in languages">
            <el-option :label="lang.label" :value="lang.value">{{
              lang.label
            }}</el-option>
          </template>
        </el-select>
      </el-form-item>

      <!-- fontSize -->
      <el-form-item :label="$t('setting.fontFamily')">
        <el-select v-model="config.fontFamily">
          <template v-for="font in fontOptions">
            <el-option :label="font" :value="font">{{ font }}</el-option>
          </template>
        </el-select>
      </el-form-item>

      <!-- fontSize -->
      <el-form-item :label="$t('setting.fontSize')">
        <el-select v-model="config.fontSize">
          <template v-for="i in fontSizeOptions">
            <el-option :label="i" :value="`${i}px`">{{ i }}</el-option>
          </template>
        </el-select>
      </el-form-item>

      <!-- fontColor -->
      <el-form-item :label="$t('setting.fontColor')">
        <el-color-picker v-model="config.color" show-alpha />
      </el-form-item>

      <!-- backgroundColor -->
      <el-form-item :label="$t('setting.backgroundColor')">
        <el-color-picker v-model="config.backgroundColor" show-alpha />
      </el-form-item>

      <!-- backgroundColor -->
      <el-form-item :label="$t('setting.enableCombo')">
        <el-switch v-model="config.enableCombo" />
      </el-form-item>

      <!-- submit -->
      <el-button
        class="save-btn"
        type="primary"
        size="default"
        @click="handleConfirm"
        >{{ $t("setting.save") }}</el-button
      >
      <el-link link type="info" @click="handleToDefault">{{
        $t("setting.reset")
      }}</el-link>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { ElForm, ElFormItem, ElButton, ElLink } from "element-plus";
import { ElColorPicker, ElSelect, ElOption, ElSwitch } from "element-plus";
import KeyPanel from "../components/KeysPanel.vue";
import { useConfig } from "../stores/config";

const store = useConfig();
const i18n = useI18n();

const { config, reset } = store;
const fontOptions = ref<string[]>([]);
const fontSizeOptions = ref<number[]>([]);
const languages = ref([
  { label: "English", value: "en_US" },
  { label: "简体中文", value: "zh_CN" },
]);

watchEffect(() => {
  i18n.locale.value = config.language;
});

for (let i = 10; i < 80; i += 5) {
  fontSizeOptions.value.push(i);
}

window.EApi.onLoadFontFamily((fonts) => {
  fontOptions.value = fonts;
});

function handleConfirm() {
  const data = JSON.stringify(config);
  window.EApi.syncConfigToFrame();
  window.EApi.saveConfig(data);
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
