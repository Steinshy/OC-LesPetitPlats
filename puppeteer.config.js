export function getBrowserOptions() {
  return {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--disable-web-security",
    ],
    headless: true,
    timeout: 60000,
  };
}

export function getPDFOptions() {
  return {
    format: "A4",
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    margin: {
      top: "20px",
      right: "20px",
      bottom: "20px",
      left: "20px",
    },
  };
}

export function getPageSetupOptions() {
  return {
    waitUntil: "networkidle0",
    timeout: 30000,
  };
}

export const pdfConfig = {
  browser: getBrowserOptions(),
  pdf: getPDFOptions(),
  page: getPageSetupOptions(),
  mediaType: "print",
};
