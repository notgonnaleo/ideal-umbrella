import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,

    allowedHosts: [
      "closely-crown-championship-supreme.trycloudflare.com",
    ],

    proxy: {
      "/api": {
        target: "https://andreas-mechanics-prev-kenny.trycloudflare.com",
        changeOrigin: true,
      },
    },
  },
});