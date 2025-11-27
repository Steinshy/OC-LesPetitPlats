#!/usr/bin/env node

import { join } from "node:path";
import sharp from "sharp";

const PROJECT_ROOT = process.cwd();
const INPUT_SVG = join(PROJECT_ROOT, "public/favicons/logo.svg");
const OUTPUT_DIR = join(PROJECT_ROOT, "public/favicons");
const SIZES = [192, 512];

const generateIcon = async (size, inputSvg, outputDir) => {
  const outputPath = join(outputDir, `icon-${size}.png`);
  await sharp(inputSvg)
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(outputPath);
  console.log(`✓ Generated icon-${size}.png (${size}x${size})`);
};

(async () => {
  try {
    console.log("Generating PNG icons from SVG...");
    await Promise.all(SIZES.map(size => generateIcon(size, INPUT_SVG, OUTPUT_DIR)));
    console.log("✓ All icons generated successfully!");
  } catch (error) {
    console.error("✗ Error generating icons:", error.message);
    process.exit(1);
  }
})();

