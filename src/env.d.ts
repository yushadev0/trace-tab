/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Gmail "Web application" OAuth client id (bkz. .env.example). */
  readonly VITE_GOOGLE_CLIENT_ID: string;
  /** Aynı client'ın secret'ı. Uzantı paketine girer; güvenlik redirect URI kısıtına dayanır. */
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
