import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,

    allowedHosts: [
      "api-screenshare.duckdns.org",
    ],

    proxy: {
      "/api": {
        target: "https://api-screenshare.duckdns.org",
        changeOrigin: true,
      },
    },
  },
});