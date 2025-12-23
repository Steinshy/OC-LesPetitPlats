import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import webfontDownload from "vite-plugin-webfont-dl";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json" with { type: "json" };

export const BASE_PATH = process.env.BASE_PATH || "/OC-LesPetitPlats/";
export const PORT = 5173;
export const OUT_DIR = "dist";

export default defineConfig(({ mode }) => {
  const compressionConfig = {
    exclude: [/\.(br)$/, /\.(gz)$/, /\.(webp)$/, /\.(jpg)$/, /\.(jpeg)$/, /\.(png)$/, /\.(woff2)$/],
    include: [/\.(js)$/, /\.(css)$/, /\.(html)$/, /\.(json)$/, /\.(svg)$/],
    threshold: 0,
    deleteOriginFile: false,
  };

  return {
    define: { __VITE_VERSION__: JSON.stringify(pkg.version) },
    base: mode === "development" ? "/" : BASE_PATH,
    root: ".",
    esbuild: {
      drop: mode === "production" ? ["console"] : [],
      legalComments: "none",
    },
    plugins: [
      tailwindcss(),
      mode !== "development" &&
        webfontDownload({
          injectAsBase64: false,
          maxRetries: 3,
          timeout: 7_000,
          cache: true,
        }),
      ...(mode !== "development"
        ? [
            { algorithm: "gzip", ext: ".gz" },
            { algorithm: "brotliCompress", ext: ".br" },
          ].map(({ algorithm, ext }) => viteCompression({ algorithm, ext, ...compressionConfig }))
        : []),
      tsconfigPaths(),
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
      sourcemap: mode !== "production",
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
            if (["tiny-lru", "query-string"].some(pkg => id.includes(pkg))) {
              return false;
            }
            return null;
          },
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
        plugins: [
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
                if (
                  fileName.endsWith(".svg") &&
                  chunk.type === "asset" &&
                  typeof chunk.source === "string"
                ) {
                  let optimized = chunk.source;
                  // Remove comments iteratively to ensure no partial comment markers remain
                  let previous;
                  do {
                    previous = optimized;
                    optimized = optimized.replace(/<!--[\S\s]*?-->/g, "");
                  } while (optimized !== previous);
                  optimized = optimized
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
            if (id.includes("query-string")) return "vendor-utils";
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
      include: ["tiny-lru", "query-string"],
      esbuildOptions: {
        treeShaking: true,
      },
    },
  };
});
