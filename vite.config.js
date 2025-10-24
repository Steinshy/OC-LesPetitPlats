import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import { EsLinter, linterPlugin } from 'vite-plugin-linter';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig((configEnv) => ({
  plugins: [
    VitePWA(),
    tailwindcss(),
    webfontDownload(),
    linterPlugin({
      include: ['./src/**/*.js'],
      linters: [new EsLinter({ configEnv })],
    }),
  ],
}));

