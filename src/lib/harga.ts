/**
 * Harga emas & perak dunia (spot) dalam rupiah per gram.
 * Dipakai oleh Pages Function /api/harga (server) dan diuji Vitest. Murni, tanpa fetch.
 */
export const GRAM_PER_TROY_OUNCE = 31.1034768;

/** Rentang wajar untuk menolak data rusak dari sumber (bukan prediksi pasar). */
export const BATAS = {
  xauUsd: [500, 20_000],
  xagUsd: [5, 500],
  usdIdr: [8_000, 40_000],
} as const;

export interface HargaLive {
  status: 'live';
  emas24: number; // Rp/gram
  perak: number; // Rp/gram
  kursUsdIdr: number;
  xauUsd: number;
  xagUsd: number;
  waktuHarga: string; // ISO, dari sumber emas
  tanggalKurs: string; // YYYY-MM-DD
  sumber: { emas: string; kurs: string };
  diambil: string; // ISO, saat server mengambil
}

const dalam = (v: number, [lo, hi]: readonly [number, number]) => Number.isFinite(v) && v >= lo && v <= hi;

export function perGram(usdPerOz: number, usdIdr: number): number {
  return Math.round((usdPerOz * usdIdr) / GRAM_PER_TROY_OUNCE);
}

/** Ambil angka dari respons gold-api.com: { price, updatedAt, symbol }. */
export function bacaGoldApi(j: unknown, simbol: 'XAU' | 'XAG'): { usd: number; waktu: string } {
  const o = j as { price?: unknown; updatedAt?: unknown; symbol?: unknown };
  const usd = Number(o?.price);
  if (o?.symbol !== simbol || !dalam(usd, simbol === 'XAU' ? BATAS.xauUsd : BATAS.xagUsd)) {
    throw new Error(`data ${simbol} tidak valid`);
  }
  const waktu = typeof o.updatedAt === 'string' && !Number.isNaN(Date.parse(o.updatedAt)) ? o.updatedAt : new Date().toISOString();
  return { usd, waktu };
}

/** Kurs dari Frankfurter ({ rates: { IDR }, date }) atau open.er-api ({ rates: { IDR }, time_last_update_utc }). */
export function bacaKurs(j: unknown): { idr: number; tanggal: string } {
  const o = j as { rates?: { IDR?: unknown }; date?: unknown; time_last_update_utc?: unknown };
  const idr = Number(o?.rates?.IDR);
  if (!dalam(idr, BATAS.usdIdr)) throw new Error('kurs tidak valid');
  let tanggal = typeof o.date === 'string' ? o.date : '';
  if (!tanggal && typeof o.time_last_update_utc === 'string') {
    const d = new Date(o.time_last_update_utc);
    if (!Number.isNaN(+d)) tanggal = d.toISOString().slice(0, 10);
  }
  return { idr, tanggal: tanggal || new Date().toISOString().slice(0, 10) };
}

export function susun(
  xau: { usd: number; waktu: string },
  xag: { usd: number; waktu: string },
  kurs: { idr: number; tanggal: string },
  sumberKurs: string,
  diambil = new Date(),
): HargaLive {
  return {
    status: 'live',
    emas24: perGram(xau.usd, kurs.idr),
    perak: perGram(xag.usd, kurs.idr),
    kursUsdIdr: kurs.idr,
    xauUsd: xau.usd,
    xagUsd: xag.usd,
    waktuHarga: xau.waktu,
    tanggalKurs: kurs.tanggal,
    sumber: { emas: 'gold-api.com (harga emas dunia)', kurs: sumberKurs },
    diambil: diambil.toISOString(),
  };
}

/** Validasi respons /api/harga di sisi browser sebelum dipakai. */
export function hargaValid(j: unknown): j is HargaLive {
  const o = j as Partial<HargaLive>;
  return o?.status === 'live'
    && Number.isFinite(o.emas24) && (o.emas24 as number) > 200_000 && (o.emas24 as number) < 20_000_000
    && Number.isFinite(o.perak) && (o.perak as number) > 1_000 && (o.perak as number) < 500_000
    && typeof o.waktuHarga === 'string';
}
