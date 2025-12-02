import { getDirname, joinPath, readFile } from "@viteTest-helper/fileSystem.js";

const CSS_FILES = [
  "variables.css",
  "layout.css",
  "cards.css",
  "tables.css",
  "markdown.css",
  "responsive.css",
];

export function loadCss() {
  const stylesDir = joinPath(getDirname(import.meta.url), "..", "styles");

  return CSS_FILES
    .map((file) => {
      const content = readFile(joinPath(stylesDir, file));
      return content ? `/* ${file} */\n${content}` : null;
    })
    .filter(Boolean)
    .join("\n\n");
}

