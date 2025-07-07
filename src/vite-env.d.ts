/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CONTRACT_TOKEN: string;
  readonly VITE_WS_PROVIDER: string;
  readonly VITE_BACK_SECRET: string;
  readonly VITE_BACK_URL: string;
  readonly VITE_ADDRESS_USDT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}