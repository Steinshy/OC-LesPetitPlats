import { writeFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import http from "node:http";
import { join } from "node:path";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { BASE_PATH, PORT, OUT_DIR } from "../vite.config.js";

// Configuration constants
const CONFIG = {
  PROJECT_ROOT: process.cwd(),
  DEFAULT_URL: `http://localhost:${PORT}${BASE_PATH}`,
  CHROME_FLAGS: ["--headless", "--no-sandbox", "--disable-gpu"],
  CATEGORIES: ["performance", "accessibility", "best-practices", "seo"],
  TIMEOUTS: {
    SERVER_WAIT: 30000,
    BUILD_CHECK: 60000,
    HTTP_REQUEST: 2000,
  },
  INTERVALS: {
    SERVER_RETRY: 500,
    BUILD_CHECK: 200,
  },
  REPORT_DIR: "Report",
  DIST_DIR: OUT_DIR,
};

const DIST_DIR = join(CONFIG.PROJECT_ROOT, CONFIG.DIST_DIR);
const INDEX_PATH = join(DIST_DIR, "index.html");

/**
 * Checks if the build output exists and is non-empty
 */
const isBuildComplete = () => {
  return existsSync(INDEX_PATH) && statSync(INDEX_PATH).size > 0;
};

/**
 * Waits for the build to complete by checking for the index.html file
 */
const waitForBuild = () => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkBuild = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= CONFIG.TIMEOUTS.BUILD_CHECK) {
        reject(new Error(`Build did not complete within ${CONFIG.TIMEOUTS.BUILD_CHECK}ms`));
        return;
      }

      if (isBuildComplete()) {
        console.log("Build completed successfully!");
        resolve();
        return;
      }

      setTimeout(checkBuild, CONFIG.INTERVALS.BUILD_CHECK);
    };

    checkBuild();
  });
};

/**
 * Gets the audit URL from command line arguments or uses the default
 */
const getAuditUrl = () => {
  return process.argv[2] || CONFIG.DEFAULT_URL;
};

/**
 * Creates output file paths for HTML and JSON reports
 */
const createOutputPaths = () => {
  const reportDir = join(CONFIG.PROJECT_ROOT, CONFIG.REPORT_DIR);
  mkdirSync(reportDir, { recursive: true });

  const dateString = new Date().toISOString().split("T")[0];
  const baseName = `lighthouse-${dateString}`;

  return {
    html: join(reportDir, `${baseName}.html`),
    json: join(reportDir, `${baseName}.json`),
  };
};

/**
 * Creates Lighthouse configuration options
 */
const createLighthouseOptions = (port) => ({
  logLevel: "info",
  output: ["html", "json"],
  onlyCategories: CONFIG.CATEGORIES,
  port,
});

/**
 * Saves HTML and JSON reports to disk
 */
const saveReports = ([htmlReport, jsonReport], { html, json }) => {
  writeFileSync(html, htmlReport);
  writeFileSync(json, jsonReport);
  console.log(`HTML report saved to: ${html}`);
  console.log(`JSON report saved to: ${json}`);
};

/**
 * Formats category name for display
 */
const formatCategoryName = (key) => {
  if (key === "best-practices") {
    return "Best Practices";
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
};

/**
 * Displays Lighthouse scores for all categories
 */
const displayScores = ({ lhr: { categories } }) => {
  console.log("\n=== Lighthouse Scores ===");
  Object.entries(categories).forEach(([key, { score }]) => {
    const name = formatCategoryName(key);
    const percentage = Math.round(score * 100);
    console.log(`${name}: ${percentage}`);
  });
};

/**
 * Checks if the server is responding
 */
const checkServerHealth = (hostname, port, pathname) => {
  return new Promise((resolve) => {
    const request = http.get(
      { hostname, port, path: pathname, timeout: CONFIG.TIMEOUTS.HTTP_REQUEST },
      (response) => {
        response.resume();
        const isReady = response.statusCode === 200 || response.statusCode === 404;
        resolve(isReady);
      },
    );

    request.on("error", () => resolve(false)).on("timeout", () => {
      request.destroy();
      resolve(false);
    });
  });
};

/**
 * Waits for the server to become ready by polling its health endpoint
 */
const waitForServer = async (url) => {
  const { hostname, port, pathname } = new URL(url);
  const startTime = Date.now();

  while (true) {
    const elapsed = Date.now() - startTime;

    if (elapsed >= CONFIG.TIMEOUTS.SERVER_WAIT) {
      throw new Error(`Server did not become ready within ${CONFIG.TIMEOUTS.SERVER_WAIT}ms`);
    }

    const isReady = await checkServerHealth(hostname, port, pathname);

    if (isReady) {
      console.log("Server is ready!");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, CONFIG.INTERVALS.SERVER_RETRY));
  }
};

/**
 * Runs the complete Lighthouse audit process
 */
const runAudit = async (url) => {
  const chrome = await launch({ chromeFlags: CONFIG.CHROME_FLAGS });

  try {
    console.log("Waiting for build to complete...");
    await waitForBuild();

    console.log(`Waiting for server to be ready: ${url}`);
    await waitForServer(url);

    console.log(`Running Lighthouse audit for: ${url}`);
    const result = await lighthouse(url, createLighthouseOptions(chrome.port));

    const outputPaths = createOutputPaths();
    saveReports(result.report, outputPaths);
    displayScores(result);
  } catch (error) {
    console.error("Error running Lighthouse:", error);
    process.exit(1);
  } finally {
    await chrome.kill();
  }
};

runAudit(getAuditUrl());
