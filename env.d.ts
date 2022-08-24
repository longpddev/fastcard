interface ImportMetaEnv {
  readonly VITE_URL_BACKEND: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
