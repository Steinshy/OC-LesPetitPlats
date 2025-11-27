import { readdirSync, unlinkSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const benchmarkDir = join(process.cwd(), "Benchmark");

// Clean up temporary files (exported for use in finalizer.js)
export function cleanupTempFiles() {
  const tempDir = join(tmpdir(), "lespetitplats-benchmark");
  const jsonFilePath = join(tempDir, "benchmark-results.json");
  if (existsSync(jsonFilePath)) {
    try {
      unlinkSync(jsonFilePath);
    } catch (_error) {
      // Ignore cleanup errors
    }
  }
}


// Clean up existing benchmark files
function cleanupBenchmarkFiles() {
  try {
    if (existsSync(benchmarkDir)) {
      const files = readdirSync(benchmarkDir);
      const filesToDelete = files.filter(
        file => file.endsWith(".html"),
        // Note: .json file is handled by clearResults() separately
      );

      if (filesToDelete.length > 0) {
        console.log(`\nCleaning up ${filesToDelete.length} existing benchmark file(s)...`);
        filesToDelete.forEach(file => {
          const filePath = join(benchmarkDir, file);
          try {
            unlinkSync(filePath);
            console.log(`  ✓ Deleted: ${file}`);
          } catch (error) {
            console.warn(`  ⚠ Failed to delete ${file}: ${error.message}`);
          }
        });
      }
    }
  } catch (error) {
    console.warn(`⚠ Warning: Could not clean up benchmark files: ${error.message}`);
  }
}

export { cleanupBenchmarkFiles };
