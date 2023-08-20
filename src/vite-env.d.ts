/// <reference types="vite/client" />
/// <reference types="./stores/config" />

declare interface Window {
  EApi: {
    onKeydown: (cb: (keyCode: string) => void) => void;
    onKeyup: (cb: (keyCode: string) => void) => void;
    onLoadFontFamily: (cb: (fonts: string[]) => void) => void;
    loadConfig: () => Promise<ConfigState>;
    saveConfig: (data: string) => void;
    syncConfigToFrame: () => void;
    onSyncConfig: (cb: () => void) => void;
  };
}
