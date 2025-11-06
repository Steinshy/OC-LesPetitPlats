import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { EsLinter, linterPlugin } from "vite-plugin-linter";
import { VitePWA } from "vite-plugin-pwa";
import webfontDownload from "vite-plugin-webfont-dl";
import tsconfigPaths from "vite-tsconfig-paths";

const BASE_PATH = "/OC-LesPetitPlats/";
const PORT = 5173;
const ONE_YEAR = 60 * 60 * 24 * 365;
const ONE_MONTH = 60 * 60 * 24 * 30;

const createCacheConfig = (name, maxEntries, maxAge) => ({
  handler: "CacheFirst",
  options: {
    cacheName: `${name}-cache`,
    expiration: { maxEntries, maxAgeSeconds: maxAge },
    cacheableResponse: { statuses: [0, 200] },
  },
});

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === "analyze";
  const isProduction = mode === "production";

  return {
    base: BASE_PATH,
    root: ".",
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicons/*.svg", "favicons/*.png"],
        manifest: {
          name: "Les Petits Plats",
          short_name: "Les Petits Plats",
          description: "Découvrez des recettes délicieuses et faciles à réaliser",
          start_url: BASE_PATH,
          scope: BASE_PATH,
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#FFD15B",
          orientation: "portrait-primary",
          lang: "fr",
          icons: [
            {
              src: `${BASE_PATH}favicons/logo.svg`,
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        strategies: "injectManifest",
        srcDir: "public",
        filename: "sw.js",
        injectManifest: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json}"],
          globIgnores: ["**/recipes/*.jpg"],
          maximumFileSizeToCacheInBytes: 5242880,
        },
        workbox: {
          navigateFallback: `${BASE_PATH}index.html`,
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              ...createCacheConfig("google-fonts", 10, ONE_YEAR),
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              ...createCacheConfig("gstatic-fonts", 10, ONE_YEAR),
            },
            {
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
              ...createCacheConfig("cdnjs", 20, ONE_MONTH),
            },
          ],
        },
        devOptions: {
          enabled: false,
          type: "module",
          navigateFallbackAllowlist: [/^\/OC-LesPetitPlats\/?$/],
        },
      }),
      tailwindcss(),
      webfontDownload(),
      linterPlugin({
        include: ["./src/**/*.js"],
        linters: [new EsLinter({ configEnv: { mode } })],
      }),
      tsconfigPaths(),
      isAnalyze &&
        visualizer({
          open: true,
          filename: "dist/stats.html",
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    server: { port: PORT, strictPort: true },
    preview: { port: PORT, strictPort: true },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      target: "esnext",
      minify: "terser",
      sourcemap: isAnalyze,
      manifest: true,
      cssCodeSplit: true,
      cssMinify: "lightningcss",
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("tailwindcss")) return "vendor-tailwind";
            if (id.includes("lru-cache")) return "vendor-cache";
            return "vendor";
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: assetInfo => {
            const ext = assetInfo.name.split(".").pop();
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return "assets/images/[name]-[hash][extname]";
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return "assets/fonts/[name]-[hash][extname]";
            }
            return "assets/[ext]/[name]-[hash][extname]";
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: false,
        },
        mangle: { properties: { regex: /^_/ } },
        format: { comments: false },
      },
    },
    optimizeDeps: {
      include: ["lru-cache"],
    },
  };
});
