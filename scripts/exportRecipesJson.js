#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { recipes } from "../public/api/data.js";

const OUTPUT_PATH = join(process.cwd(), "public/api/data.json");

(async () => {
  try {
    await writeFile(OUTPUT_PATH, JSON.stringify(recipes, null, 2));
    console.info(`✓ Exported ${recipes.length} recipes to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error(`✗ Failed to export recipes to JSON: ${error.message}`);
    process.exit(1);
  }
})();
