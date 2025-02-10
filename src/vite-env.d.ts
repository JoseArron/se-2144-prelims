/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string,
    readonly VITE_SMS_API_TOKEN: string,
    readonly VITE_SMS_API_URL: string,
    readonly VITE_CELLPHONE_NUMS: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }