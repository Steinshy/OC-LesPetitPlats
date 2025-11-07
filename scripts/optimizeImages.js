#!/usr/bin/env node

import { mkdir, readdir } from "node:fs/promises";
import { join, parse } from "node:path";

import sharp from "sharp";

const INPUT_DIR = "./public/images";
const OUTPUT_DIR = "./public/images/optimized";

const IMAGE_QUALITY = { webp: 85, jpeg: 85 };
const RESIZE_OPTIONS = { fit: "cover", position: "center" };

const SIZES = [
  { name: "thumbnail", width: 300, height: 200 },
  { name: "medium", width: 600, height: 400 },
  { name: "large", width: 1200, height: 800 },
];

const SUPPORTED_FORMATS = /\.(jpg|jpeg)$/i;

const FORMATS = [
  {
    ext: "webp",
    apply: image => image.webp({ quality: IMAGE_QUALITY.webp }),
  },
  {
    ext: "jpg",
    apply: image => image.jpeg({ quality: IMAGE_QUALITY.jpeg, progressive: true }),
  },
];

async function ensureOutputDir() {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.info(`✓ Dossier ${OUTPUT_DIR} créé/vérifié`);
  } catch (error) {
    console.error(`✗ Erreur lors de la création du dossier: ${error.message}`);
    throw error;
  }
}

async function processVariant(baseImage, size, baseName, format) {
  const outputPath = join(OUTPUT_DIR, `${baseName}-${size.name}.${format.ext}`);
  const resizedImage = baseImage.clone().resize(size.width, size.height, RESIZE_OPTIONS);
  await format.apply(resizedImage).toFile(outputPath);
}

async function optimizeImage(inputPath, filename) {
  const { name: baseName } = parse(filename);
  try {
    const baseImage = sharp(inputPath);
    const variants = [];

    for (const size of SIZES) {
      for (const format of FORMATS) {
        variants.push(processVariant(baseImage, size, baseName, format));
      }
    }

    await Promise.all(variants);
    console.info(`✓ ${filename} optimisé`);
  } catch (error) {
    console.error(`✗ Erreur lors de l'optimisation de ${filename}: ${error.message}`);
  }
}

async function main() {
  console.info("🖼️  Démarrage de l'optimisation des images...\n");

  try {
    await ensureOutputDir();

    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter(file => SUPPORTED_FORMATS.test(file));

    if (imageFiles.length === 0) {
      console.warn("⚠️  Aucune image trouvée");
      return;
    }

    console.info(`📂 ${imageFiles.length} images trouvées\n`);

    for (const filename of imageFiles) {
      await optimizeImage(join(INPUT_DIR, filename), filename);
    }

    const totalGenerated = imageFiles.length * SIZES.length * FORMATS.length;
    console.info("\n✨ Optimisation terminée avec succès !");
    console.info(`📊 ${totalGenerated} fichiers générés`);
  } catch (error) {
    console.error(`❌ Erreur fatale: ${error.message}`);
    process.exit(1);
  }
}

main();
