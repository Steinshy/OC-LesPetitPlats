#!/usr/bin/env node

import { resolve } from "node:path";
import sharp from "sharp";

const INPUT_SVG = resolve("./public/favicons/logo.svg");
const OUTPUT_DIR = resolve("./public/favicons");

const SIZES = [192, 512];

async function generateIcons() {
  try {
    console.log("Generating PNG icons from SVG...");

    for (const size of SIZES) {
      const outputPath = resolve(OUTPUT_DIR, `icon-${size}.png`);

      await sharp(INPUT_SVG)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated icon-${size}.png (${size}x${size})`);
    }

    console.log("✓ All icons generated successfully!");
  } catch (error) {
    console.error("✗ Error generating icons:", error.message);
    process.exit(1);
  }
}

generateIcons();

