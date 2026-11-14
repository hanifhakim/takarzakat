import type { APIRoute } from 'astro';
import acuan from '../data/acuan.json';
import { JENIS } from '../lib/jenis';

export const GET: APIRoute = ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const paths = ['/', ...JENIS.map((j) => `/${j.slug}`), '/metodologi'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${base}${p}</loc><lastmod>${acuan.diperbarui}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
