// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://takarzakat.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' }, // /zakat-penghasilan.html → URL /zakat-penghasilan di Cloudflare Pages
  compressHTML: true,
});
