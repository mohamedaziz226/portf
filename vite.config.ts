import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { contactApiPlugin } from "./scripts/vite-plugin-contact-api";

// https://vitejs.dev/config/
export default defineConfig({
  // `contactApiPlugin` serves POST /api/contact from `api/contact.ts` in dev + preview.
  plugins: [react(), contactApiPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});
