/// <reference types="vite/client" />

interface ImportMetaEnv{
    readonly VITE_SEVER_API_URL: string
}

interface ImportMeta{
    readonly env: VITE_SEVER_API_URL
}