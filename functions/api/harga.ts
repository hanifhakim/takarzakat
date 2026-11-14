/**
 * GET /api/harga — harga emas & perak dunia (Rp/gram), di-cache di edge Cloudflare 1 jam.
 * Browser hanya memanggil domain sendiri: IP pengunjung tidak dikirim ke pihak ketiga.
 * Sumber: gold-api.com (USD/oz, tanpa key) × kurs USD/IDR (Frankfurter/ECB, cadangan open.er-api.com).
 */
import { bacaGoldApi, bacaKurs, susun } from '../../src/lib/harga';

const CACHE_DETIK = 3600;
const GAGAL_DETIK = 120;
const UA = { 'user-agent': 'TakarZakat/1.0 (+https://takarzakat.pages.dev)' };

async function json(url: string): Promise<unknown> {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error(`${new URL(url).host} ${r.status}`);
  return r.json();
}

async function kurs() {
  try {
    return { ...bacaKurs(await json('https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR')), sumber: 'Frankfurter (kurs ECB)' };
  } catch {
    return { ...bacaKurs(await json('https://open.er-api.com/v6/latest/USD')), sumber: 'ExchangeRate-API (open.er-api.com)' };
  }
}

function balas(body: unknown, detik: number, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${Math.min(detik, 900)}, s-maxage=${detik}`,
      'access-control-allow-origin': '*',
      'x-content-type-options': 'nosniff',
    },
  });
}

export const onRequestGet = async (ctx: { request: Request; waitUntil: (p: Promise<unknown>) => void }) => {
  const cache = (caches as unknown as { default: Cache }).default;
  const kunci = new Request(new URL('/api/harga', ctx.request.url).toString(), { method: 'GET' });
  const tersimpan = await cache.match(kunci);
  if (tersimpan) return tersimpan;

  let res: Response;
  try {
    const [xau, xag, k] = await Promise.all([
      json('https://api.gold-api.com/price/XAU').then((j) => bacaGoldApi(j, 'XAU')),
      json('https://api.gold-api.com/price/XAG').then((j) => bacaGoldApi(j, 'XAG')),
      kurs(),
    ]);
    res = balas(susun(xau, xag, k, k.sumber), CACHE_DETIK);
  } catch (e) {
    // Browser akan memakai angka bawaan (acuan.json). Cache singkat supaya sumber tidak dibanjiri.
    res = balas({ status: 'gagal', pesan: String((e as Error)?.message ?? e).slice(0, 120) }, GAGAL_DETIK, 503);
  }
  ctx.waitUntil(cache.put(kunci, res.clone()));
  return res;
};
