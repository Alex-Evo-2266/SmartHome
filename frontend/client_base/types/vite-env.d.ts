/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HOST: string
    readonly VITE_API_AUTH: string
    readonly VITE_SMARTHOME_CLIENT_ID: string

    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }