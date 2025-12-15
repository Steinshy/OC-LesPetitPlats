import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const SOURCE_DIR = "JSON recipes";

const CARD_WEBP_QUALITY = 80;
const HERO_WEBP_QUALITY = 82;

async function createWebpVariant(inputPath, outputPath, quality) {
  await sharp(inputPath)
    .webp({
      quality,
      effort: 5,
    })
    .toFile(outputPath);
}

async function getFileSize(filePath) {
  try {
    const { size } = await stat(filePath);
    return size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, index)) * 100) / 100} ${sizes[index]}`;
}

async function main() {
  try {
    const files = await readdir(SOURCE_DIR);

    const jpgFiles = files.filter(
      file =>
        extname(file).toLowerCase() === ".jpg" &&
        file.startsWith("Recette") &&
        (file.includes("-card") || file.includes("-hero")),
    );

    if (jpgFiles.length === 0) {
      console.log(`No card/hero JPG files found in ${SOURCE_DIR}`);
      return;
    }

    console.log(`Found ${jpgFiles.length} JPG variants to convert to WebP\n`);

    let totalJpgSize = 0;
    let totalWebpSize = 0;

    for (const file of jpgFiles) {
      const inputPath = join(SOURCE_DIR, file);
      const baseName = basename(file, ".jpg");
      const outputPath = join(SOURCE_DIR, `${baseName}.webp`);

      const jpgSize = await getFileSize(inputPath);
      totalJpgSize += jpgSize;

      const isCard = baseName.endsWith("-card");
      const quality = isCard ? CARD_WEBP_QUALITY : HERO_WEBP_QUALITY;

      console.log(`Processing ${file} → ${baseName}.webp...`);

      await createWebpVariant(inputPath, outputPath, quality);

      const webpSize = await getFileSize(outputPath);
      totalWebpSize += webpSize;

      const reduction = ((jpgSize - webpSize) / jpgSize) * 100;

      console.log(
        `  ✓ ${isCard ? "Card" : "Hero"}: ${formatBytes(jpgSize)} (JPG) → ${formatBytes(
          webpSize,
        )} (WebP, q=${quality}) (${reduction.toFixed(1)}% change)`,
      );
      console.log("");
    }

    console.log("=".repeat(60));
    console.log("Summary:");
    console.log(`  Total JPG size: ${formatBytes(totalJpgSize)} (${jpgFiles.length} files)`);
    console.log(`  Total WebP size: ${formatBytes(totalWebpSize)} (${jpgFiles.length} files)`);
    console.log(
      `  Net change: ${formatBytes(totalWebpSize - totalJpgSize)} (${(
        ((totalWebpSize - totalJpgSize) / totalJpgSize) *
        100
      ).toFixed(1)}%)`,
    );
    console.log("=".repeat(60));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
