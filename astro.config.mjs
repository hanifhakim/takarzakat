// @ts-check
import { defineConfig } from 'astro/config';
import pascaBuild from './integrations/pasca-build.mjs';
import { SITUS } from './src/data/situs';

export default defineConfig({
  site: 'https://takarzakat.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' }, // /zakat-penghasilan.html → URL /zakat-penghasilan di Cloudflare Pages
  compressHTML: true,
  integrations: [pascaBuild({ analytics: Boolean(SITUS.analytics) })],
});
