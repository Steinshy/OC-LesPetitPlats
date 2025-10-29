import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { EsLinter, linterPlugin } from "vite-plugin-linter";
import { VitePWA } from "vite-plugin-pwa";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig((configEnv) => {
  const isAnalyze = configEnv.mode === "analyze";
  const base = process.env.BASE_PATH || "/";

  return {
    base,
    root: ".",
    plugins: [
      VitePWA(),
      tailwindcss(),
      webfontDownload(),
      linterPlugin({
        include: ["./src/**/*.js"],
        linters: [new EsLinter({ configEnv })],
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
  };
});
