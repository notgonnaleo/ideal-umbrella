import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,

    allowedHosts: [
      "continue-alternatives-translated-honest.trycloudflare.com",
    ],

    proxy: {
      "/api": {
        target: "http://localhost:5145",
        changeOrigin: true,
      },
    },
  },
});
