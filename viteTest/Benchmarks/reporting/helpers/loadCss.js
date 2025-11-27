import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CSS_FILES = [
  "variables.css",
  "layout.css",
  "cards.css",
  "tables.css",
  "markdown.css",
  "responsive.css",
];

export function loadCss() {
  const stylesDir = resolve(__dirname, "../styles");
  let cssContent = "";

  for (const cssFile of CSS_FILES) {
    const cssPath = join(stylesDir, cssFile);
    try {
      const fileContent = readFileSync(cssPath, "utf-8");
      cssContent += `\n/* ${cssFile} */\n${fileContent}\n`;
    } catch (error) {
      console.warn(`Could not load CSS file: ${cssFile}`, error.message);
    }
  }

  return cssContent;
}

