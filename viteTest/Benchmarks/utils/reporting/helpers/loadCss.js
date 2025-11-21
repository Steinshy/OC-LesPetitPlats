// CSS Loading Helper - Loads and concatenates CSS files
// Since @import doesn't work in inline <style> tags, we need to read and concatenate all CSS files
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CSS file order based on main.css imports
const CSS_FILES = [
  "variables.css",
  "base.css",
  "header.css",
  "sections.css",
  "tableOfContents.css",
  "cards.css",
  "tables.css",
  "charts.css",
  "markdown.css",
  "responsive.css",
];

export function loadCss() {
  const stylesDir = join(__dirname, "../styles");
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

