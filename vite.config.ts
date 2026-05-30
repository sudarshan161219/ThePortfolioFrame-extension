import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],

  build: {
    rollupOptions: {
      input: {
        editor: resolve(__dirname, "editor.html"),
        popup: resolve(__dirname, "popup.html"),
        upload: resolve(__dirname, "upload.html"),
      },

      output: {
        manualChunks(id) {
          if (id.includes("@remotion/web-renderer")) return "remotion-renderer";
          if (id.includes("remotion") || id.includes("@remotion"))
            return "remotion-core";
          if (id.includes("html-to-image")) return "html-to-image";
          if (id.includes("html2canvas")) return "html2canvas";
          if (id.includes("react-dom") || id.includes("react"))
            return "react-vendor";
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
