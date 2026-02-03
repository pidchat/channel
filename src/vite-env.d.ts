/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CONTRACT_TOKEN: string;
  readonly VITE_WS_PROVIDER: string;
  readonly VITE_CONTRACT_GOVERNANCE: string;
  readonly VITE_URL_CHANNEL_WEB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}