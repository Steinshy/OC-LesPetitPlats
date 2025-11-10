#!/usr/bin/env node

import { access, constants, mkdir, readdir, rename, rm } from "node:fs/promises";
import { join, parse, resolve } from "node:path";

import sharp from "sharp";

const INPUT_DIR = resolve(process.argv[2] ?? "./public/recipes");
const OUTPUT_DIR = resolve(process.argv[3] ?? INPUT_DIR);

const IMAGE_QUALITY = { webp: 75, jpeg: 75 };
const MAX_OUTPUT_SIZE = { width: 1600, height: 1200, fit: "inside", withoutEnlargement: true };
const SUPPORTED_FORMATS = /\.(jpg|jpeg)$/i;
const CONCURRENCY_LIMIT = Number.parseInt(process.env.IMAGE_OPTIMIZER_CONCURRENCY, 10) || 4;

const FORMATS = [
  {
    ext: "webp",
    apply: image => image.webp({ quality: IMAGE_QUALITY.webp }),
  },
  {
    ext: "jpg",
    apply: image =>
      image.jpeg({
        quality: IMAGE_QUALITY.jpeg,
        progressive: true,
        chromaSubsampling: "4:4:4",
      }),
  },
];

const removeIfExists = async targetPath => {
  try {
    await rm(targetPath, { force: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

async function ensureOutputDir() {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.info(`✓ Dossier ${OUTPUT_DIR} créé/vérifié`);
  } catch (error) {
    console.error(`✗ Erreur lors de la création du dossier: ${error.message}`);
    throw error;
  }
}

async function assertInputDirExists() {
  try {
    await access(INPUT_DIR, constants.R_OK);
  } catch (error) {
    console.error(`❌ Dossier source introuvable ou illisible: ${INPUT_DIR}`);
    throw error;
  }
}

async function processVariant(baseImage, baseName, format) {
  const outputPath = join(OUTPUT_DIR, `${baseName}.${format.ext}`);
  const tempPath = `${outputPath}.${process.pid}.tmp`;

  const resizedImage = baseImage.clone().resize(MAX_OUTPUT_SIZE);
  await format.apply(resizedImage).toFile(tempPath);
  await removeIfExists(outputPath);
  await rename(tempPath, outputPath);
}

async function optimizeImage(inputPath, filename) {
  const { name: baseName } = parse(filename);
  try {
    const baseImage = sharp(inputPath);
    await Promise.all(FORMATS.map(format => processVariant(baseImage, baseName, format)));
    console.info(`✓ ${filename} optimisé`);
  } catch (error) {
    console.error(`✗ Erreur lors de l'optimisation de ${filename}: ${error.message}`);
  }
}

async function processWithLimit(items, limit, handler) {
  const executing = new Set();
  for (const item of items) {
    const pendingTask = handler(item).finally(() => executing.delete(pendingTask));
    executing.add(pendingTask);
    if (executing.size >= limit) await Promise.race(executing);
  }
  await Promise.all(executing);
}

async function main() {
  console.info("🖼️  Démarrage de l'optimisation des images...\n");

  try {
    await assertInputDirExists();
    await ensureOutputDir();

    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter(file => SUPPORTED_FORMATS.test(file));

    if (imageFiles.length === 0) {
      console.warn("⚠️  Aucune image trouvée");
      return;
    }

    console.info(`📂 ${imageFiles.length} images trouvées\n`);

    await processWithLimit(
      imageFiles,
      CONCURRENCY_LIMIT,
      filename => optimizeImage(join(INPUT_DIR, filename), filename),
    );

    const totalGenerated = imageFiles.length * FORMATS.length;
    console.info("\n✨ Optimisation terminée avec succès !");
    console.info(`📊 ${totalGenerated} fichiers générés`);
  } catch (error) {
    console.error(`❌ Erreur fatale: ${error.message}`);
    process.exit(1);
  }
}

main();
