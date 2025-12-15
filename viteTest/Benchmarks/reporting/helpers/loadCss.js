import { getDirname, joinPath, readFile } from "@viteTest-helper/fileSystem.js";
import { shouldMinify, minifyCss } from "./minify.js";

const CSS_FILES = [
  "variables.css",
  "layout.css",
  "cards.css",
  "tables.css",
  "markdown.css",
  "responsive.css",
];

export async function loadCss() {
  const stylesDir = joinPath(getDirname(import.meta.url), "..", "styles");

  let css = CSS_FILES
    .map((file) => {
      const content = readFile(joinPath(stylesDir, file));
      if (!content) return null;

      if (shouldMinify()) {
        return content;
      }
      return `/* ${file} */\n${content}`;
    })
    .filter(Boolean)
    .join(shouldMinify() ? "" : "\n\n");

  if (shouldMinify()) {
    css = await minifyCss(css);
  }

  return css;
}

