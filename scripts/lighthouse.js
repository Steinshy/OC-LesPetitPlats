import { writeFileSync, existsSync, statSync } from "node:fs";
import http from "node:http";
import { join } from "node:path";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { generateReportPath } from "./reportUtils.js";

const PROJECT_ROOT = process.cwd();
const DIST_DIR = join(PROJECT_ROOT, "dist");
const DEFAULT_URL = "http://localhost:5173/OC-LesPetitPlats/";
const CHROME_FLAGS = ["--headless", "--no-sandbox", "--disable-gpu"];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const MAX_WAIT_TIME = 30000;
const RETRY_INTERVAL = 500;
const BUILD_CHECK_INTERVAL = 200;
const BUILD_CHECK_TIMEOUT = 60000;

const waitForBuild = () =>
  new Promise((resolve, reject) => {
    const startTime = Date.now();
    const indexPath = join(DIST_DIR, "index.html");

    const checkBuild = () => {
      if (Date.now() - startTime >= BUILD_CHECK_TIMEOUT) {
        reject(new Error(`Build did not complete within ${BUILD_CHECK_TIMEOUT}ms`));
        return;
      }

      if (existsSync(indexPath) && statSync(indexPath).size > 0) {
        console.log("Build completed successfully!");
        resolve();
        return;
      }

      setTimeout(checkBuild, BUILD_CHECK_INTERVAL);
    };

    checkBuild();
  });

const getAuditUrl = () => process.argv[2] || DEFAULT_URL;

const createOutputPaths = () => ({
  html: generateReportPath("lighthouse", "html", PROJECT_ROOT),
  json: generateReportPath("lighthouse", "json", PROJECT_ROOT),
});

const createLighthouseOptions = port => ({
  logLevel: "info",
  output: ["html", "json"],
  onlyCategories: CATEGORIES,
  port,
});

const saveReports = ([htmlReport, jsonReport], { html, json }) => {
  writeFileSync(html, htmlReport);
  writeFileSync(json, jsonReport);
  console.log(`HTML report saved to: ${html}`);
  console.log(`JSON report saved to: ${json}`);
};

const displayScores = ({ lhr: { categories } }) => {
  console.log("\n=== Lighthouse Scores ===");
  Object.entries(categories).forEach(([key, { score }]) => {
    const name = key === "best-practices" ? "Best Practices" : key.charAt(0).toUpperCase() + key.slice(1);
    console.log(`${name}: ${Math.round(score * 100)}`);
  });
};

const waitForServer = url =>
  new Promise((resolve, reject) => {
    const startTime = Date.now();
    const { hostname, port, pathname } = new URL(url);
    let resolved = false;
    let currentRequest = null;

    const cleanup = () => {
      currentRequest?.destroy();
      currentRequest = null;
    };

    const retry = () => {
      if (resolved) return;
      cleanup();
      if (Date.now() - startTime >= MAX_WAIT_TIME) {
        resolved = true;
        reject(new Error(`Server did not become ready within ${MAX_WAIT_TIME}ms`));
        return;
      }
      setTimeout(checkServer, RETRY_INTERVAL);
    };

    const checkServer = () => {
      if (resolved) return;

      currentRequest = http.get({ hostname, port, path: pathname, timeout: 2000 }, response => {
        if (resolved) return;
        response.resume();
        if (response.statusCode === 200 || response.statusCode === 404) {
          resolved = true;
          console.log("Server is ready!");
          cleanup();
          resolve();
        } else {
          retry();
        }
      });

      currentRequest.on("error", retry).on("timeout", retry);
    };

    checkServer();
  });

const runAudit = async url => {
  const chrome = await launch({ chromeFlags: CHROME_FLAGS });
  try {
    console.log("Waiting for build to complete...");
    await waitForBuild();

    console.log(`Waiting for server to be ready: ${url}`);
    await waitForServer(url);

    console.log(`Running Lighthouse audit for: ${url}`);
    const result = await lighthouse(url, createLighthouseOptions(chrome.port));

    saveReports(result.report, createOutputPaths());
    displayScores(result);
  } catch (error) {
    console.error("Error running Lighthouse:", error);
    process.exit(1);
  } finally {
    await chrome.kill();
  }
};

runAudit(getAuditUrl());
