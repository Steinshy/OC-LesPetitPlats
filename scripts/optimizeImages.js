#!/usr/bin/env node

/**
 * Image Optimization Script
 * Generates multiple sizes and formats (WebP, JPEG) for responsive images
 */

import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";

import sharp from "sharp";

// Directories
const INPUT_DIR = "./public/images";
const OUTPUT_DIR = "./public/images/optimized";

// Image quality settings
const IMAGE_QUALITY = {
  webp: 85,
  jpeg: 85,
};

// Responsive image sizes
const SIZES = [
  { name: "thumbnail", width: 300, height: 200 },
  { name: "medium", width: 600, height: 400 },
  { name: "large", width: 1200, height: 800 },
];

// Supported file formats
const SUPPORTED_FORMATS = /\.(jpg|jpeg)$/i;

async function ensureOutputDir() {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.info(`✓ Dossier ${OUTPUT_DIR} créé/vérifié`);
  } catch (error) {
    console.error("Erreur lors de la création du dossier:", error);
    throw error;
  }
}

async function generateWebP(image, size, name) {
  await image
    .clone()
    .resize(size.width, size.height, {
      fit: "cover",
      position: "center",
    })
    .webp({ quality: IMAGE_QUALITY.webp })
    .toFile(join(OUTPUT_DIR, `${name}-${size.name}.webp`));
}

async function generateJPEG(image, size, name) {
  await image
    .clone()
    .resize(size.width, size.height, {
      fit: "cover",
      position: "center",
    })
    .jpeg({
      quality: IMAGE_QUALITY.jpeg,
      progressive: true,
    })
    .toFile(join(OUTPUT_DIR, `${name}-${size.name}.jpg`));
}

async function optimizeImage(inputPath, filename) {
  const { name } = parse(filename);

  try {
    const image = sharp(inputPath);

    for (const size of SIZES) {
      await generateWebP(image, size, name);
      await generateJPEG(image, size, name);
    }

    console.info(`✓ ${filename} optimisé`);
  } catch (error) {
    console.error(`✗ Erreur lors de l'optimisation de ${filename}:`, error);
  }
}

async function main() {
  console.info("🖼️  Démarrage de l'optimisation des images...\n");

  try {
    await ensureOutputDir();

    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter((file) => SUPPORTED_FORMATS.test(file));

    console.info(`📂 ${imageFiles.length} images trouvées\n`);

    for (const file of imageFiles) {
      await optimizeImage(join(INPUT_DIR, file), file);
    }

    const totalGenerated = imageFiles.length * SIZES.length * 2;
    console.info("\n✨ Optimisation terminée avec succès !");
    console.info(`📊 ${totalGenerated} fichiers générés`);
  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  }
}

main();
