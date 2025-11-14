import js from "@eslint/js";
import htmlPlugin from "eslint-plugin-html";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      import: importPlugin,
      jsdoc,
      security,
      sonarjs,
      unicorn,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(_|[A-Z])",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": ["off"],
      "no-debugger": "warn",
      "no-var": "warn",
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",
      "arrow-spacing": "warn",
      "object-shorthand": "warn",
      "prefer-template": "warn",

      "comma-dangle": ["warn", "always-multiline"],
      quotes: ["warn", "double", { avoidEscape: true }],
      semi: ["warn", "always"],
      "no-trailing-spaces": "warn",

      "max-len": [
        "warn",
        {
          code: 200,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      complexity: ["warn", 25],
      "max-depth": ["warn", 8],
      "max-lines-per-function": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],

      "no-duplicate-imports": "warn",
      "import/no-unresolved": [
        "warn",
        {
          ignore: [
            "^\\./",
            "^\\.\\./",
            "^node:",
            "^@/",
            "^@tailwindcss/",
            "^tailwindcss",
            "^vitest",
            "^tinybench",
            "^tiny-lru",
            "^puppeteer",
            "^chartjs-node-canvas",
            "^chart\\.js",
            "^@testing-library/",
            "^fs$",
            "^path$",
            "^url$",
            "^os$",
            "^crypto$",
            "^stream$",
            "^util$",
            "^events$",
            "^buffer$",
            "^process$",
            "^child_process$",
            "^http$",
            "^https$",
            "^net$",
            "^dns$",
            "^zlib$",
            "^readline$",
            "^cluster$",
            "^worker_threads$",
            "^perf_hooks$",
            "^v8$",
            "^vm$",
            "^assert$",
            "^console$",
            "^querystring$",
            "^string_decoder$",
            "^tls$",
            "^tty$",
            "^punycode$",
          ],
        },
      ],
      "import/no-absolute-path": "warn",
      "import/no-self-import": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "ignore",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",

      "security/detect-eval-with-expression": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-object-injection": "off",

      "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }],
      "sonarjs/cognitive-complexity": ["warn", 25],
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/no-nested-template-literals": "off",
      "sonarjs/no-small-switch": "off",

      "unicorn/better-regex": "warn",
      "unicorn/no-array-for-each": "off",
      "unicorn/prefer-query-selector": "off",
      "unicorn/prefer-modern-dom-apis": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
      "unicorn/prefer-spread": "warn",
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "@dist/",
      "dev-dist/",
      "build/",
      "public/",
      "coverage/",
      ".stryker-tmp/",
      "Benchmark/",
      "api/data.js",
      "public/api/data.js",
      "*.min.js",
      "*.min.css",
      "*.log",
      "lighthouse/",
      "lighthouse-report*.html",
      "lighthouse-report*.json",
      "lighthouse-report-formatted.json",
      ".lighthouseci/",
      ".husky/",
      ".cursor/",
      ".vscode/",
      ".idea/",
      ".oc/",
      ".DS_Store",
    ],
  },
];
