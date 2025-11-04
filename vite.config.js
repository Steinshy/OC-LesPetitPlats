// vite.config.js
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { EsLinter, linterPlugin } from "vite-plugin-linter";
import { VitePWA } from "vite-plugin-pwa";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === "analyze";

  return {
    base: "/OC-LesPetitPlats/",

    root: ".",

    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Les Petits Plats",
          short_name: "LPP",
          start_url: "/OC-LesPetitPlats/",
          scope: "/OC-LesPetitPlats/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            // update these to your real icons if you have them
            // { src: "/OC-LesPetitPlats/pwa-192x192.png", sizes: "192x192", type: "image/png" },
            // { src: "/OC-LesPetitPlats/pwa-512x512.png", sizes: "512x512", type: "image/png" },
            // { src: "/OC-LesPetitPlats/pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
      }),

      tailwindcss(),
      webfontDownload(),

      linterPlugin({
        include: ["./src/**/*.js"],
        linters: [new EsLinter({ configEnv: { mode } })],
      }),

      isAnalyze &&
        visualizer({
          open: true,
          filename: "dist/stats.html",
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        external: ["fsevents"],
        output: {
          manualChunks: {
            vendor: ["vite-plugin-pwa"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
