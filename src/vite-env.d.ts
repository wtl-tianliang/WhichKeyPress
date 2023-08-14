/// <reference types="vite/client" />

declare interface Window {
  EApi: {
    onKeydown: (cb: (keyCode: string) => void) => void;
    onKeyup: (cb: (keyCode: string) => void) => void;
    onLoadFontFamily: (cb: (fonts: string[]) => void) => void;
    syncConfig: () => void;
    onSyncConfig: (cb: () => void) => void;
  };
}
