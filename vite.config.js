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
const CSS_TARGET = ["chrome61", "safari11"];
const COMMONJS_INCLUDE = [/node_modules/];
const { version: APP_VERSION } = require("./package.json");

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
          globIgnores: [
            "**/recipes/*.jpg",
            "**/api/data-benchmark.json", // Exclude large benchmark data file (14.6 MB) from PWA cache
          ],
          maximumFileSizeToCacheInBytes: 5242880,
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
          maxRetries: 3,
          timeout: 7_000,
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
      outDir: "dist",
      emptyOutDir: true,
      target: "esnext",
      minify: "esbuild",
      sourcemap: true,
      manifest: true,
      cssCodeSplit: true,
      cssMinify: "lightningcss",
      cssTarget: CSS_TARGET,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 4096,
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
            const treeShakeablePackages = ["tiny-lru", "neverthrow", "query-string", "toastify-js"];
            if (treeShakeablePackages.some(pkg => id.includes(pkg))) {
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
              limit: 20, // Show top 20 largest modules
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
                if (/\.(woff|ttf|eot)$/i.test(fileName) && !fileName.endsWith(".woff2")) {
                  delete bundle[fileName];
                }
              });
            },
          },
        ].filter(Boolean),
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("tailwindcss")) return "vendor-tailwind";
            if (id.includes("tiny-lru")) return "vendor-cache";
            if (id.includes("neverthrow")) return "vendor-utils";
            if (id.includes("query-string")) return "vendor-utils";
            if (id.includes("toastify-js")) return "vendor-ui";
            if (id.includes("remixicon")) return "vendor-icons"; // Separate icon font
            return "vendor";
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: assetInfo => {
            const ext = assetInfo.name.split(".").pop();
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return "assets/images/[name]-[hash][extname]";
            }
            if (/woff2$/i.test(ext)) {
              return "assets/fonts/[name]-[hash][extname]";
            }
            return "assets/[ext]/[name]-[hash][extname]";
          },
          compact: true,
        },
      },
    },
    optimizeDeps: {
      include: ["tiny-lru", "neverthrow", "query-string", "toastify-js"],
      esbuildOptions: {
        treeShaking: true,
      },
    },
  };
});
