/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HOST: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }