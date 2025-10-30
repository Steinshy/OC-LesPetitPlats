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
          code: 180,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      complexity: ["warn", 20],
      "max-depth": ["warn", 6],
      "max-lines-per-function": [
        "warn",
        { max: 250, skipBlankLines: true, skipComments: true },
      ],

      "no-duplicate-imports": "warn",
      "import/no-unresolved": [
        "warn",
        { ignore: ["^@tailwindcss/", "^tailwindcss", "^vitest"] },
      ],
      "import/no-absolute-path": "warn",
      "import/no-self-import": "warn",
      "import/order": [
        "warn",
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

      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",

      "security/detect-eval-with-expression": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-object-injection": "off",

      "sonarjs/no-duplicate-string": ["warn", { threshold: 4 }],
      "sonarjs/cognitive-complexity": ["warn", 20],
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/no-nested-template-literals": "off",

      "unicorn/better-regex": "warn",
      "unicorn/no-array-for-each": "off",
      "unicorn/prefer-query-selector": "off",
      "unicorn/prefer-modern-dom-apis": "warn",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",

      "prettier/prettier": "warn",
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
