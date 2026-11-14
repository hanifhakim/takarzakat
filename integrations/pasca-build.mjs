/**
 * Setelah build: (1) tulis dist/sw.js dengan daftar precache + versi dari isi berkas,
 * (2) tulis dist/_headers dengan CSP yang memuat hash setiap script inline.
 * Tanpa dependensi; dijalankan otomatis oleh `astro build`.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEMPLATE = fileURLToPath(new URL('./sw.template.js', import.meta.url));

function semua(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? semua(p) : [p];
  });
}

/** Berkas yang disimpan untuk offline. Sengaja melewatkan .woff (sudah ada .woff2), OG image, 404, dan peta situs. */
export function daftarPrecache(files) {
  const urls = [];
  for (const rel of files) {
    if (/^(og|icons)\//.test(rel) && !/icon-192\.png$/.test(rel)) continue;
    if (/-(latin-ext|vietnamese|cyrillic|cyrillic-ext|greek)-/.test(rel)) continue; // hanya subset latin & arab yang dipakai
    if (/\.(woff|map|txt|xml)$/.test(rel) || rel === '_headers' || rel === 'sw.js' || rel === '404.html') continue;
    if (rel.endsWith('.html')) urls.push(rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, ''));
    else urls.push('/' + rel);
  }
  return urls.sort();
}

/** Hash sha256 (base64) untuk tiap <script> inline yang bisa dieksekusi. */
export function hashInline(html) {
  const out = new Set();
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs) || /type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs) || !m[2]) continue;
    out.add(`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
  }
  return out;
}

export function buatHeaders(hashes, analytics) {
  const cfJs = analytics ? ' https://static.cloudflareinsights.com' : '';
  const cfConn = analytics ? ' https://cloudflareinsights.com' : '';
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].sort().join(' ')}${cfJs}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${cfConn}`,
    "manifest-src 'self'",
    "worker-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join('; ');
  return `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache

/manifest.webmanifest
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=3600

/og/*
  Cache-Control: public, max-age=86400

/icons/*
  Cache-Control: public, max-age=86400
`;
}

export default function pascaBuild({ analytics = false } = {}) {
  return {
    name: 'takar-pasca-build',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = semua(root).map((p) => relative(root, p).split(sep).join('/'));

        const hashes = new Set();
        const h = createHash('sha256');
        for (const rel of files.sort()) {
          const buf = readFileSync(join(root, rel));
          if (rel.endsWith('.html')) for (const x of hashInline(buf.toString('utf8'))) hashes.add(x);
          if (rel !== 'sw.js' && rel !== '_headers') h.update(rel).update(buf);
        }

        const pre = daftarPrecache(files);
        const versi = h.digest('hex').slice(0, 10);
        const sw = readFileSync(TEMPLATE, 'utf8')
          .replace('__VERSI__', versi)
          .replace('__PRECACHE__', JSON.stringify(pre));
        writeFileSync(join(root, 'sw.js'), sw);
        writeFileSync(join(root, '_headers'), buatHeaders(hashes, analytics));
        logger.info(`sw.js ${versi}: ${pre.length} berkas precache · CSP: ${hashes.size} hash inline`);
      },
    },
  };
}
