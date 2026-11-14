import { describe, expect, it } from 'vitest';
import { buatHeaders, daftarPrecache, hashInline } from '../../integrations/pasca-build.mjs';
import { gabung, labelHarga } from './acuan-store';
import { ACUAN } from './zakat';

describe('precache', () => {
  it('URL bersih, tanpa .woff/OG/404/subset lain', () => {
    const p = daftarPrecache([
      'index.html', 'zakat-fitrah.html', '404.html', 'sitemap.xml', 'robots.txt', '_headers', 'sw.js',
      '_astro/a.123.js', '_astro/plus-jakarta-sans-latin-400-normal.abc.woff2', '_astro/plus-jakarta-sans-latin-400-normal.abc.woff',
      '_astro/fraunces-vietnamese-wght-normal.x.woff2', '_astro/fraunces-latin-ext-wght-normal.x.woff2',
      'og/umum.png', 'icons/icon-192.png', 'icons/icon-512.png', 'manifest.webmanifest', 'favicon.svg',
    ]);
    expect(p).toEqual([
      '/', '/_astro/a.123.js', '/_astro/plus-jakarta-sans-latin-400-normal.abc.woff2',
      '/favicon.svg', '/icons/icon-192.png', '/manifest.webmanifest', '/zakat-fitrah',
    ]);
  });
});

describe('CSP', () => {
  it('hash hanya script inline yang dieksekusi', () => {
    const h = hashInline('<script>a()</script><script type="module">b()</script><script src="/x.js"></script><script type="application/ld+json">{}</script>');
    expect(h.size).toBe(2);
    expect([...h][0]).toMatch(/^'sha256-[A-Za-z0-9+/=]+'$/);
  });
  it('analitik membuka domain Cloudflare hanya bila aktif', () => {
    expect(buatHeaders(new Set(["'sha256-x'"]), false)).not.toContain('cloudflareinsights');
    const on = buatHeaders(new Set(["'sha256-x'"]), true);
    expect(on).toContain("script-src 'self' 'sha256-x' https://static.cloudflareinsights.com");
    expect(on).toContain("connect-src 'self' https://cloudflareinsights.com");
    expect(on).toContain("frame-ancestors 'none'");
  });
});

describe('label harga offline', () => {
  const t = Date.parse('2026-11-14T12:00:00Z');
  it('live + offline → harga tersimpan', () => {
    const a = gabung(null, ACUAN, { emas24: 2_300_000, perak: 30_000, waktuHarga: '2026-11-14T09:00:00Z', status: 'live' } as never);
    expect(labelHarga(a, t, true)).toBe('harga emas dunia · 3 jam lalu');
    expect(labelHarga(a, t, false)).toBe('offline · harga tersimpan 3 jam lalu');
  });
  it('bawaan + offline', () => {
    expect(labelHarga(gabung(null), t, false)).toMatch(/^offline · bawaan /);
  });
});
