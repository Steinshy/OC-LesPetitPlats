import { createRequire } from "node:module";
import tailwindcss from "@tailwindcss/vite";
import analyzer from "rollup-plugin-analyzer";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import webfontDownload from "vite-plugin-webfont-dl";
import tsconfigPaths from "vite-tsconfig-paths";

const require = createRequire(import.meta.url);
const BASE_PATH = process.env.BASE_PATH || "/OC-LesPetitPlats/";
const PORT = 5173;
const CSS_TARGET = ["chrome61", "safari11", "firefox115"];
const COMMONJS_INCLUDE = [/node_modules/];
const { version: APP_VERSION } = require("./package.json");

// App metadata
const APP_NAME = "Les Petits Plats";
const APP_SHORT_NAME = "Les Petits Plats";
const APP_DESCRIPTION = "Découvrez des recettes délicieuses et faciles à réaliser";
const APP_LANG = "fr";
const APP_THEME_COLOR = "#FFD15B";
const APP_BG_COLOR = "#ffffff";

// Build configuration
const OUT_DIR = "dist";
const CHUNK_SIZE_WARNING_LIMIT = 500;
const ASSETS_INLINE_LIMIT = 4096;
const MAX_FILE_SIZE_TO_CACHE = 5_242_880;

// File patterns
const IMAGE_EXTENSIONS = /png|jpe?g|svg|gif|tiff|bmp|ico/i;
const FONT_EXTENSIONS = /woff2$/i;
const LEGACY_FONT_EXTENSIONS = /\.(woff|ttf|eot)$/i;

// Vendor packages for code splitting
const TREE_SHAKEABLE_PACKAGES = ["tiny-lru", "neverthrow", "query-string", "toastify-js"];
const VENDOR_CHUNKS = {
  tailwind: "tailwindcss",
  cache: "tiny-lru",
  utils: ["neverthrow", "query-string"],
  ui: "toastify-js",
  icons: "remixicon",
};

// Plugin configuration
const WEBFONT_TIMEOUT = 7_000;
const WEBFONT_MAX_RETRIES = 3;
const ANALYZER_LIMIT = 20;

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === "analyze";
  const isProduction = mode === "production";
  const isDev = mode === "development";

  return {
    define: { __VITE_VERSION__: JSON.stringify(APP_VERSION) },
    base: isDev ? "/" : BASE_PATH,
    root: ".",
    esbuild: {
      drop: isProduction ? ["console"] : [],
      legalComments: "none",
    },
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicons/*.svg", "favicons/*.png"],
        manifest: {
          name: APP_NAME,
          short_name: APP_SHORT_NAME,
          description: APP_DESCRIPTION,
          start_url: BASE_PATH,
          scope: BASE_PATH,
          display: "standalone",
          background_color: APP_BG_COLOR,
          theme_color: APP_THEME_COLOR,
          orientation: "portrait-primary",
          lang: APP_LANG,
          icons: [
            {
              src: `${BASE_PATH}favicons/logo.svg`,
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
            {
              src: `${BASE_PATH}favicons/icon-192.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: `${BASE_PATH}favicons/icon-512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        strategies: "injectManifest",
        srcDir: "public",
        filename: "sw.js",
        injectManifest: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json}"],
          globIgnores: ["**/recipes/*.jpg", "**/api/data-benchmark.json"],
          maximumFileSizeToCacheInBytes: MAX_FILE_SIZE_TO_CACHE,
        },
        workbox: {
          navigateFallback: `${BASE_PATH}index.html`,
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        },
        devOptions: {
          enabled: false,
          type: "module",
          navigateFallbackAllowlist: [
            new RegExp(`^${BASE_PATH.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&")}?$`),
          ],
        },
      }),
      tailwindcss(),
      !isDev &&
        webfontDownload({
          injectAsBase64: false,
          maxRetries: WEBFONT_MAX_RETRIES,
          timeout: WEBFONT_TIMEOUT,
          cache: true,
        }),
      !isDev &&
        viteCompression({
          algorithm: "gzip",
          ext: ".gz",
          exclude: [
            /\.(br)$/,
            /\.(gz)$/,
            /\.(webp)$/,
            /\.(jpg)$/,
            /\.(jpeg)$/,
            /\.(png)$/,
            /\.(woff2)$/,
          ],
          include: [/\.(js)$/, /\.(css)$/, /\.(html)$/, /\.(json)$/, /\.(svg)$/],
          threshold: 0,
          deleteOriginFile: false,
        }),
      !isDev &&
        viteCompression({
          algorithm: "brotliCompress",
          ext: ".br",
          exclude: [
            /\.(br)$/,
            /\.(gz)$/,
            /\.(webp)$/,
            /\.(jpg)$/,
            /\.(jpeg)$/,
            /\.(png)$/,
            /\.(woff2)$/,
          ],
          include: [/\.(js)$/, /\.(css)$/, /\.(html)$/, /\.(json)$/, /\.(svg)$/],
          threshold: 0,
          deleteOriginFile: false,
        }),
      tsconfigPaths(),
      isAnalyze &&
        visualizer({
          filename: "dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: "sunburst", // Options: 'treemap', 'sunburst', 'network'
        }),
    ].filter(Boolean),
    resolve: {
      dedupe: [],
    },
    server: {
      port: PORT,
      strictPort: true,
      hmr: {
        protocol: "ws",
      },
    },
    preview: { port: PORT, strictPort: true },
    build: {
      outDir: OUT_DIR,
      emptyOutDir: true,
      target: "esnext",
      minify: "esbuild",
      sourcemap: true,
      manifest: true,
      cssCodeSplit: true,
      cssMinify: "lightningcss",
      cssTarget: CSS_TARGET,
      reportCompressedSize: true,
      chunkSizeWarningLimit: CHUNK_SIZE_WARNING_LIMIT,
      assetsInlineLimit: ASSETS_INLINE_LIMIT,
      dynamicImportVarsOptions: {
        warnOnError: true,
        exclude: [/node_modules/],
      },
      commonjsOptions: {
        include: COMMONJS_INCLUDE,
        transformMixedEsModules: true,
      },
      rollupOptions: {
        treeshake: {
          moduleSideEffects: id => {
            // Allow tree-shaking for npm packages that support it
            if (TREE_SHAKEABLE_PACKAGES.some(pkg => id.includes(pkg))) {
              return false;
            }
            return null;
          },
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
        plugins: [
          isAnalyze &&
            analyzer({
              summaryOnly: false,
              limit: ANALYZER_LIMIT,
              writeTo: analysis => {
                console.log("\n📊 Bundle Analysis & Recommendations:\n");
                console.log(analysis);
              },
            }),
          {
            name: "exclude-remixicon-svg",
            generateBundle(options, bundle) {
              // Remove remixicon SVG files from the bundle
              Object.keys(bundle).forEach(fileName => {
                if (fileName.includes("remixicon") && fileName.endsWith(".svg")) {
                  delete bundle[fileName];
                }
              });
            },
          },
          {
            name: "exclude-legacy-fonts",
            generateBundle(options, bundle) {
              // Remove legacy font formats (woff, ttf, eot) - only keep woff2
              Object.keys(bundle).forEach(fileName => {
                if (LEGACY_FONT_EXTENSIONS.test(fileName) && !fileName.endsWith(".woff2")) {
                  delete bundle[fileName];
                }
              });
            },
          },
        ].filter(Boolean),
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes(VENDOR_CHUNKS.tailwind)) return "vendor-tailwind";
            if (id.includes(VENDOR_CHUNKS.cache)) return "vendor-cache";
            if (VENDOR_CHUNKS.utils.some(pkg => id.includes(pkg))) return "vendor-utils";
            if (id.includes(VENDOR_CHUNKS.ui)) return "vendor-ui";
            if (id.includes(VENDOR_CHUNKS.icons)) return "vendor-icons";
            return "vendor";
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: assetInfo => {
            const ext = assetInfo.name.split(".").pop();
            if (IMAGE_EXTENSIONS.test(ext)) {
              return "assets/images/[name]-[hash][extname]";
            }
            if (FONT_EXTENSIONS.test(ext)) {
              return "assets/fonts/[name]-[hash][extname]";
            }
            return "assets/[ext]/[name]-[hash][extname]";
          },
          compact: true,
        },
      },
    },
    optimizeDeps: {
      include: TREE_SHAKEABLE_PACKAGES,
      esbuildOptions: {
        treeShaking: true,
      },
    },
  };
});
