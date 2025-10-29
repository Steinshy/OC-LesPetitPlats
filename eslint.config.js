import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import htmlPlugin from "eslint-plugin-html";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier";
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
      prettier,
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
      // Variable and code quality rules
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(_|[A-Z])",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "arrow-spacing": "error",
      "object-shorthand": "error",
      "prefer-template": "error",

      // Style rules
      "comma-dangle": ["error", "always-multiline"],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
      "no-trailing-spaces": "error",

      // Complexity rules
      "max-len": [
        "warn",
        {
          code: 160,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      complexity: ["warn", 15],
      "max-depth": ["warn", 5],
      "max-lines-per-function": [
        "warn",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],

      // Import rules
      "no-duplicate-imports": "error",
      "import/no-unresolved": [
        "error",
        { ignore: ["^@tailwindcss/", "^tailwindcss", "^vitest"] },
      ],
      "import/no-absolute-path": "error",
      "import/no-self-import": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],

      // JSDoc rules
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",

      // Security rules
      "security/detect-eval-with-expression": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-object-injection": "off",

      // SonarJS rules (code smells)
      "sonarjs/no-duplicate-string": ["warn", { threshold: 3 }],
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/no-nested-template-literals": "off",

      // Unicorn rules (best practices)
      "unicorn/better-regex": "error",
      "unicorn/no-array-for-each": "off",
      "unicorn/prefer-query-selector": "warn",
      "unicorn/prefer-modern-dom-apis": "warn",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",

      // Prettier integration
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "public/",
      "coverage/",
      "*.min.js",
      "*.min.css",
      "*.log",
      ".lighthouseci/",
      ".husky/",
      ".cursor/",
      ".vscode/",
      ".idea/",
      ".DS_Store",
    ],
  },
];
