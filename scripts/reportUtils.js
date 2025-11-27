// Utility functions for report generation
import { mkdirSync } from "node:fs";
import { join } from "node:path";

export const getDateString = () => new Date().toISOString().split("T")[0];

const ensureReportDir = projectRoot => {
  const reportDir = join(projectRoot, "Report");
  mkdirSync(reportDir, { recursive: true });
  return reportDir;
};
export const generateReportPath = (prefix, extension = "", projectRoot) => {
  const reportDir = ensureReportDir(projectRoot);
  const filename = extension ? `${prefix}-${getDateString()}.${extension}` : `${prefix}-${getDateString()}`;
  return join(reportDir, filename);
};

