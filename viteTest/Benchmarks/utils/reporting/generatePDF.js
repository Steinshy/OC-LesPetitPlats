// Generate PDF from HTML using Puppeteer
import puppeteer from "puppeteer";
import { pdfConfig } from "../../../../puppeteer.config.js";

export async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch(pdfConfig.browser);
  const page = await browser.newPage();

  try {
    // Set content and wait for it to load
    await page.setContent(html, pdfConfig.page);

    // Emulate print media to ensure print CSS (@media print) is applied
    // This is critical for page-break CSS properties to work
    await page.emulateMediaType(pdfConfig.mediaType);

    // Generate PDF with configuration from config file
    await page.pdf({
      ...pdfConfig.pdf,
      path: outputPath,
    });
  } finally {
    await browser.close();
  }
}
