/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * HTTP endpoint that receives the contact form as JSON (`POST`).
   * Defaults to the bundled serverless function: "/api/contact".
   * Set an absolute URL to use an external service instead
   * (e.g. VITE_CONTACT_ENDPOINT="https://formspree.io/f/xxxxxxx").
   *
   * Only public values belong here — the API key (RESEND_API_KEY) and the
   * destination inbox (CONTACT_EMAIL) are read server side by `api/contact.ts`.
   */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
