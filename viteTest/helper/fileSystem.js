// File system utilities for viteTest
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export function ensureDirectory(dirPath) {
  try {
    mkdirSync(dirPath, { recursive: true });
    return true;
  } catch (_error) {
    return false;
  }
}

export function writeFile(filePath, content, encoding = "utf-8") {
  try {
    const dir = dirname(filePath);
    ensureDirectory(dir);
    writeFileSync(filePath, content, encoding);
    return true;
  } catch (error) {
    console.warn(`Failed to write file ${filePath}:`, error.message);
    return false;
  }
}

export function readFile(filePath, encoding = "utf-8") {
  try {
    if (existsSync(filePath)) {
      return readFileSync(filePath, encoding);
    }
    return null;
  } catch (error) {
    console.warn(`Failed to read file ${filePath}:`, error.message);
    return null;
  }
}

export function pathExists(path) {
  return existsSync(path);
}

export function deleteFile(filePath) {
  try {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    return true;
  } catch (error) {
    console.warn(`Failed to delete file ${filePath}:`, error.message);
    return false;
  }
}

export function listFiles(dirPath) {
  try {
    if (existsSync(dirPath)) {
      return readdirSync(dirPath);
    }
    return [];
  } catch (error) {
    console.warn(`Failed to list files in ${dirPath}:`, error.message);
    return [];
  }
}

export function deleteFiles(dirPath, filterFn) {
  try {
    if (!pathExists(dirPath)) {
      return 0;
    }

    const files = listFiles(dirPath);
    const filesToDelete = files.filter(filterFn);
    let deletedCount = 0;

    filesToDelete.forEach(file => {
      const filePath = joinPath(dirPath, file);
      if (deleteFile(filePath)) {
        deletedCount++;
      }
    });

    return deletedCount;
  } catch (error) {
    console.warn(`Failed to delete files in ${dirPath}:`, error.message);
    return 0;
  }
}

export function getDirname(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
}

export function resolveFromRoot(...pathParts) {
  return resolve(process.cwd(), ...pathParts);
}

export function joinPath(...pathParts) {
  return join(...pathParts);
}

