/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FILE_UPLOAD_LIMIT: string;
  readonly IMAGE_ANY_URL: string;
  readonly BACKEND_MODE: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
