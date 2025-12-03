import tailwindcss from "@tailwindcss/vite";
import analyzer from "rollup-plugin-analyzer";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import webfontDownload from "vite-plugin-webfont-dl";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json" with { type: "json" };
import { generateAnalyze } from "./scripts/analyze.js";

export const BASE_PATH = process.env.BASE_PATH || "/OC-LesPetitPlats/";
export const PORT = 5173;
export const OUT_DIR = "dist";

export default defineConfig(({ mode }) => {
  const escapeRegex = (string) => string.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
  const basePathPattern = new RegExp(`^${escapeRegex(BASE_PATH)}?$`);
  const internalPathPattern = /^\/_/;
  const fileExtensionPattern = /\/[^/?]+\.[^/]+$/;

  return {
    define: { __VITE_VERSION__: JSON.stringify(pkg.version) },
    base: mode === "development" ? "/" : BASE_PATH,
    root: ".",
    esbuild: {
      drop: mode === "production" ? ["console"] : [],
      legalComments: "none",
    },
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicons/*.svg", "favicons/*.png"],
        manifest: {
          $schema: "https://json.schemastore.org/web-manifest-combined.json",
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
              src: `${BASE_PATH}favicons/pwa-192x192.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: `${BASE_PATH}favicons/pwa-512x512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: `${BASE_PATH}favicons/maskable-icon-512x512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: `${BASE_PATH}favicons/logo.svg`,
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
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
            "**/recipes/*.webp",
            "**/mockup/**",
            "**/viteTest/**",
            "**/scripts/**",
            "**/benchmark-results/**",
            "**/Benchmark/**",
            "**/Report/**",
            "**/*.test.js",
            "**/*.spec.js",
          ],
          maximumFileSizeToCacheInBytes: 5_242_880,
        },
        workbox: {
          navigateFallback: `${BASE_PATH}index.html`,
          navigateFallbackDenylist: [internalPathPattern, fileExtensionPattern],
        },
        devOptions: {
          enabled: false,
          type: "module",
          navigateFallbackAllowlist: [basePathPattern],
        },
      }),
      tailwindcss(),
      mode !== "development" &&
        webfontDownload({
          injectAsBase64: false,
          maxRetries: 3,
          timeout: 7_000,
          cache: true,
        }),
      mode !== "development" &&
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
      mode !== "development" &&
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
      mode === "analyze" &&
        visualizer({
          filename: generateAnalyze(),
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: "treemap",
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
      cssTarget: ["chrome61", "safari11", "firefox115"],
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 4096,
      dynamicImportVarsOptions: {
        warnOnError: true,
        exclude: [/node_modules/],
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      rollupOptions: {
        treeshake: {
          moduleSideEffects: id => {
            // Allow tree-shaking for npm packages that support it
            if (["tiny-lru", "neverthrow", "query-string", "toastify-js"].some(pkg => id.includes(pkg))) {
              return false;
            }
            return null;
          },
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
        plugins: [
          mode === "analyze" &&
            analyzer({
              summaryOnly: false,
              limit: 20,
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
          mode !== "development" && {
            name: "optimize-svg",
            generateBundle(options, bundle) {
              // Optimize SVG files by removing unnecessary attributes and whitespace
              Object.entries(bundle).forEach(([fileName, chunk]) => {
                if (fileName.endsWith(".svg") && chunk.type === "asset" && typeof chunk.source === "string") {
                  const optimized = chunk.source
                    // Remove comments
                    .replace(/<!--[\S\s]*?-->/g, "")
                    // Remove XML declaration
                    .replace(/<\?xml[^>]*\?>/gi, "")
                    // Remove DOCTYPE
                    .replace(/<!doctype[^>]*>/gi, "")
                    // Remove unnecessary whitespace
                    .replace(/\s+/g, " ")
                    .replace(/>\s+</g, "><")
                    .trim();
                  // Only update if optimization reduced size
                  if (optimized.length < chunk.source.length) {
                    chunk.source = optimized;
                  }
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
            if (["neverthrow", "query-string"].some(pkg => id.includes(pkg))) return "vendor-utils";
            if (id.includes("toastify-js")) return "vendor-ui";
            if (id.includes("remixicon")) return "vendor-icons";
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
