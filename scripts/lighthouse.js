import { writeFileSync, mkdirSync, rmSync, existsSync, statSync } from "fs";
import http from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const LIGHTHOUSE_DIR = join(PROJECT_ROOT, "lighthouse");
const DIST_DIR = join(PROJECT_ROOT, "dist");
const BASE_PATH = "/OC-LesPetitPlats/";
const DEFAULT_PORT = 5173;
const DEFAULT_URL = `http://localhost:${DEFAULT_PORT}${BASE_PATH}`;
const CHROME_FLAGS = ["--headless", "--no-sandbox", "--disable-gpu"];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const MAX_WAIT_TIME = 30000;
const RETRY_INTERVAL = 500;
const BUILD_CHECK_INTERVAL = 200;
const BUILD_CHECK_TIMEOUT = 60000;

const cleanLighthouseDir = () => {
  try {
    rmSync(LIGHTHOUSE_DIR, { recursive: true, force: true });
    console.log(`Cleaned lighthouse directory: ${LIGHTHOUSE_DIR}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Warning: Could not clean lighthouse directory: ${error.message}`);
    }
  }
};

const ensureLighthouseDir = () => {
  mkdirSync(LIGHTHOUSE_DIR, { recursive: true });
};

const waitForBuild = () => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkBuild = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= BUILD_CHECK_TIMEOUT) {
        reject(new Error(`Build did not complete within ${BUILD_CHECK_TIMEOUT}ms`));
        return;
      }

      // Check if dist directory exists and has index.html
      const indexPath = join(DIST_DIR, "index.html");
      if (existsSync(DIST_DIR) && existsSync(indexPath)) {
        try {
          const stats = statSync(indexPath);
          // Ensure file was written recently (within last 5 seconds) or has content
          if (stats.size > 0) {
            console.log("Build completed successfully!");
            resolve();
            return;
          }
        } catch (_error) {
          // File might still be writing, continue checking
        }
      }

      setTimeout(checkBuild, BUILD_CHECK_INTERVAL);
    };

    checkBuild();
  });
};

const getAuditUrl = () => {
  return process.argv[2] || DEFAULT_URL;
};

const createOutputPaths = () => {
  const timestamp = Date.now();
  const basePath = join(LIGHTHOUSE_DIR, `report-${timestamp}`);
  return {
    html: `${basePath}.html`,
    json: `${basePath}.json`,
  };
};

const launchChrome = async () => {
  return launch({
    chromeFlags: CHROME_FLAGS,
  });
};

const createLighthouseOptions = port => ({
  logLevel: "info",
  output: ["html", "json"],
  onlyCategories: CATEGORIES,
  port,
});

const saveReports = (reports, paths) => {
  const [htmlReport, jsonReport] = reports;

  writeFileSync(paths.html, htmlReport);
  console.log(`HTML report saved to: ${paths.html}`);

  writeFileSync(paths.json, jsonReport);
  console.log(`JSON report saved to: ${paths.json}`);
};

const displayScores = result => {
  const scores = result.lhr.categories;
  console.log("\n=== Lighthouse Scores ===");
  console.log(`Performance: ${Math.round(scores.performance.score * 100)}`);
  console.log(`Accessibility: ${Math.round(scores.accessibility.score * 100)}`);
  console.log(`Best Practices: ${Math.round(scores["best-practices"].score * 100)}`);
  console.log(`SEO: ${Math.round(scores.seo.score * 100)}`);
};

const waitForServer = url => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    let resolved = false;
    let currentRequest = null;

    const checkServer = () => {
      if (resolved) return;

      currentRequest = http.get(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname,
          timeout: 2000,
        },
        response => {
          if (resolved) return;
          response.resume(); // Consume response to free up memory

          if (response.statusCode === 200 || response.statusCode === 404) {
            resolved = true;
            console.log("Server is ready!");
            resolve();
          } else {
            retry();
          }
        },
      );

      currentRequest.on("error", () => {
        if (!resolved) {
          retry();
        }
      });

      currentRequest.on("timeout", () => {
        currentRequest.destroy();
        if (!resolved) {
          retry();
        }
      });
    };

    const retry = () => {
      if (resolved) return;

      if (currentRequest) {
        currentRequest.destroy();
        currentRequest = null;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed >= MAX_WAIT_TIME) {
        resolved = true;
        reject(new Error(`Server did not become ready within ${MAX_WAIT_TIME}ms`));
        return;
      }
      setTimeout(checkServer, RETRY_INTERVAL);
    };

    checkServer();
  });
};

const runAudit = async url => {
  let chrome = null;

  try {
    console.log("Waiting for build to complete...");
    await waitForBuild();

    console.log(`Waiting for server to be ready: ${url}`);
    await waitForServer(url);

    console.log(`Running Lighthouse audit for: ${url}`);
    console.log(`Output directory: ${LIGHTHOUSE_DIR}`);

    chrome = await launchChrome();
    const options = createLighthouseOptions(chrome.port);
    const result = await lighthouse(url, options);

    const paths = createOutputPaths();
    saveReports(result.report, paths);
    displayScores(result);
  } catch (error) {
    console.error("Error running Lighthouse:", error);
    process.exit(1);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
};

const main = () => {
  cleanLighthouseDir();
  ensureLighthouseDir();
  const url = getAuditUrl();
  runAudit(url);
};

main();
