import { minify as minifyHtml } from "html-minifier-terser";
import CleanCSS from "clean-css";

function isProductionMode() {
  return process.env.NODE_ENV === "production" || process.env.BENCHMARK_MINIFY === "true";
}

export function shouldMinify() {
  return isProductionMode();
}

export async function minifyCss(css) {
  if (!shouldMinify()) {
    return css;
  }

  try {
    const cleanCSS = new CleanCSS({
      level: 2,
      returnPromise: true,
    });

    const result = await cleanCSS.minify(css);
    if (result.errors && result.errors.length > 0) {
      console.warn("⚠️ CSS minification warnings:", result.errors);
    }
    return result.styles || css;
  } catch (error) {
    console.warn("⚠️ CSS minification failed, using original CSS:", error.message);
    return css;
  }
}

export async function minifyHtmlContent(html) {
  if (!shouldMinify()) {
    return html;
  }

  try {
    const minified = await minifyHtml(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: false,
      minifyJS: false,
      caseSensitive: false,
      keepClosingSlash: false,
    });

    return minified || html;
  } catch (error) {
    console.warn("⚠️ HTML minification failed, using original HTML:", error.message);
    return html;
  }
}

