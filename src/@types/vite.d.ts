/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CLIENT_FILE_UPLOAD_LIMIT: string;
  readonly CLIENT_IMAGE_ANY_URL: string;
  readonly CLIENT_BACKEND_MODE: string;
  readonly CLIENT_SUPABASE_URL?: string;
  readonly CLIENT_SUPABASE_ANON_KEY?: string;
  readonly CLIENT_FEEDBACK_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
