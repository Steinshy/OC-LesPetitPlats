#!/usr/bin/env node

import { access, constants, mkdir, readdir, rename, rm } from "node:fs/promises";
import { join, parse } from "node:path";

import sharp from "sharp";

const PROJECT_ROOT = process.cwd();
const INPUT_DIR = process.argv[2] ? join(PROJECT_ROOT, process.argv[2]) : join(PROJECT_ROOT, "public/recipes");
const OUTPUT_DIR = process.argv[3] ? join(PROJECT_ROOT, process.argv[3]) : INPUT_DIR;

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

const ensureOutputDir = async () => {
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.info(`✓ Dossier ${OUTPUT_DIR} créé/vérifié`);
};

const assertInputDirExists = async () => {
  try {
    await access(INPUT_DIR, constants.R_OK);
  } catch (error) {
    console.error(`❌ Dossier source introuvable ou illisible: ${INPUT_DIR}`);
    throw error;
  }
};

const processVariant = async (baseImage, baseName, format) => {
  const outputPath = join(OUTPUT_DIR, `${baseName}.${format.ext}`);
  const tempPath = `${outputPath}.${process.pid}.tmp`;
  await format.apply(baseImage.clone().resize(MAX_OUTPUT_SIZE)).toFile(tempPath);
  await removeIfExists(outputPath);
  await rename(tempPath, outputPath);
};

const optimizeImage = async (inputPath, filename) => {
  try {
    const baseImage = sharp(inputPath);
    const { name: baseName } = parse(filename);
    await Promise.all(FORMATS.map(format => processVariant(baseImage, baseName, format)));
    console.info(`✓ ${filename} optimisé`);
  } catch (error) {
    console.error(`✗ Erreur lors de l'optimisation de ${filename}: ${error.message}`);
  }
};

const processWithLimit = async (items, limit, handler) => {
  const executing = new Set();
  for (const item of items) {
    const task = handler(item).finally(() => executing.delete(task));
    executing.add(task);
    if (executing.size >= limit) await Promise.race(executing);
  }
  await Promise.all(executing);
};

(async () => {
  console.info("🖼️  Démarrage de l'optimisation des images...\n");

  try {
    await assertInputDirExists();
    await ensureOutputDir();

    const imageFiles = (await readdir(INPUT_DIR)).filter(file => SUPPORTED_FORMATS.test(file));

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

    console.info("\n✨ Optimisation terminée avec succès !");
    console.info(`📊 ${imageFiles.length * FORMATS.length} fichiers générés`);
  } catch (error) {
    console.error(`❌ Erreur fatale: ${error.message}`);
    process.exit(1);
  }
})();
