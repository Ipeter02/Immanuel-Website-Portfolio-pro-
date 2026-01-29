interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_USE_CUSTOM_SERVER: string
  readonly VITE_CUSTOM_API_URL: string
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  [key: string]: any
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
