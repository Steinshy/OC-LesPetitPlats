import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["viteTest/reference/**/*.test.js"],
    exclude: [],
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        useAtomics: true,
        minThreads: 1,
        maxThreads: 1,
      },
    },
    testTimeout: 30000,
    reporters: [
      [
        "default",
        {
          summary: false,
        },
      ],
    ],
  },
});

