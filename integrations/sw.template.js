// @ts-nocheck
/* TakarZakat service worker — dibuat otomatis saat build (integrations/pasca-build.mjs). */
const VERSI = 'takar-__VERSI__';
const HARGA = 'takar-harga';
const PRECACHE = __PRECACHE__;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('takar-') && k !== VERSI && k !== HARGA).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Jaringan dulu dengan batas waktu; gagal → cache. */
async function jaringanDulu(req, cacheName, kunci, ms) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, tolak) => setTimeout(() => tolak(new Error('timeout')), ms)),
    ]);
    if (res.ok) cache.put(kunci, res.clone());
    return res;
  } catch (err) {
    const lama = await cache.match(kunci, { ignoreSearch: true });
    if (lama) return lama;
    throw err;
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Harga emas: selalu coba terbaru; offline → harga terakhir yang tersimpan.
  if (url.pathname === '/api/harga') {
    e.respondWith(jaringanDulu(req, HARGA, '/api/harga', 5000));
    return;
  }

  // Halaman: jaringan dulu supaya selalu versi terbaru; offline → salinan tersimpan → beranda.
  if (req.mode === 'navigate') {
    const kunci = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    e.respondWith(
      jaringanDulu(req, VERSI, kunci, 4000).catch(async () => (await caches.match('/', { cacheName: VERSI })) || Response.error()),
    );
    return;
  }

  // Aset: cache dulu (nama berkas /_astro/ sudah mengandung hash).
  e.respondWith(
    caches.match(req, { cacheName: VERSI }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && url.pathname.startsWith('/_astro/')) {
        const salinan = res.clone();
        caches.open(VERSI).then((c) => c.put(req, salinan));
      }
      return res;
    })),
  );
});
