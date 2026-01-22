/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CONTRACT_TOKEN: string;
  readonly VITE_WS_PROVIDER: string;
  readonly VITE_CONTRACT_GOVERNANCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}