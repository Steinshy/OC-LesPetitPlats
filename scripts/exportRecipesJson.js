#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

import { recipes } from "../public/api/data.js";

const OUTPUT_PATH = "./public/api/data.json";

async function exportRecipes() {
  try {
    const json = JSON.stringify(recipes, null, 2);
    await writeFile(OUTPUT_PATH, json);
    console.info(`✓ Exported ${recipes.length} recipes to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error(`✗ Failed to export recipes to JSON: ${error.message}`);
    process.exit(1);
  }
}

exportRecipes();
