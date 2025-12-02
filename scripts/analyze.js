import { mkdirSync } from "node:fs";
import { join } from "node:path";

export function generateAnalyze() {
  const reportDir = join(process.cwd(), "Report");
  mkdirSync(reportDir, { recursive: true });
  const dateString = new Date().toISOString().split("T")[0];
  return join(reportDir, `analyze-${dateString}.html`);
}

