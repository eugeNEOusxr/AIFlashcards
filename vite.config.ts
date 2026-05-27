import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Cognitive Learning System",
        short_name: "CLS",
        description: "Mobile-first cognitive learning — modes, selection, reflections",
        start_url: "/",
        display: "standalone",
        background_color: "#0b0d12",
        theme_color: "#0b0d12",
        orientation: "portrait-primary",
        icons: [
          {
            src: "icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,ico}"],
        navigateFallback: "index.html",
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  publicDir: "public",
});
