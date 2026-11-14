#!/usr/bin/env node
// Perbarui harga emas & perak cadangan di src/data/acuan.json dari sumber yang sama dengan /api/harga.
// Dijalankan mingguan oleh .github/workflows/harga-mingguan.yml (bisa juga manual: npm run update:harga).
// Butuh Node ≥ 22.18 (impor .ts langsung). Gagal (exit 1) bila sumber mati atau lonjakan > BATAS_LONJAK.
import { readFile, writeFile } from 'node:fs/promises';
import { bacaGoldApi, bacaKurs, susun } from '../src/lib/harga.ts';

const FILE = new URL('../src/data/acuan.json', import.meta.url);
const BATAS_LONJAK = 0.3; // perubahan > 30% dalam seminggu dianggap data rusak → perlu dicek manusia
const UA = { 'user-agent': 'TakarZakat-update/1.0 (+https://github.com/hanifhakim/takarzakat)' };

async function json(url) {
  for (let coba = 1; coba <= 3; coba++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(10_000) });
      if (r.ok) return await r.json();
      throw new Error(`${r.status}`);
    } catch (e) {
      if (coba === 3) throw new Error(`${new URL(url).host}: ${e.message}`);
      await new Promise((ok) => setTimeout(ok, 2000 * coba));
    }
  }
}

async function kurs() {
  try {
    return { ...bacaKurs(await json('https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR')), sumber: 'Frankfurter/ECB' };
  } catch {
    return { ...bacaKurs(await json('https://open.er-api.com/v6/latest/USD')), sumber: 'ExchangeRate-API' };
  }
}

const id = (n, d = 0) => n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });

const [xau, xag, k] = await Promise.all([
  json('https://api.gold-api.com/price/XAU').then((j) => bacaGoldApi(j, 'XAU')),
  json('https://api.gold-api.com/price/XAG').then((j) => bacaGoldApi(j, 'XAG')),
  kurs(),
]);
const h = susun(xau, xag, k, k.sumber);
const data = JSON.parse(await readFile(FILE, 'utf8'));

for (const [nama, lama, baru] of [['emas', data.emas24.nilai, h.emas24], ['perak', data.perak.nilai, h.perak]]) {
  const ubah = Math.abs(baru - lama) / lama;
  if (ubah > BATAS_LONJAK) {
    console.error(`Harga ${nama} berubah ${(ubah * 100).toFixed(1)}% (${lama} → ${baru}). Tidak diperbarui; cek sumber secara manual.`);
    process.exit(1);
  }
}

const tanggal = h.diambil.slice(0, 10);
data.diperbarui = tanggal;
data.emas24 = {
  ...data.emas24,
  nilai: h.emas24,
  sumber: `gold-api.com (XAU ${id(h.xauUsd, 2)} USD/oz) × ${k.sumber} (${id(h.kursUsdIdr)})`,
  tanggal,
};
data.perak = {
  ...data.perak,
  nilai: h.perak,
  sumber: `gold-api.com (XAG ${id(h.xagUsd, 2)} USD/oz) × ${k.sumber} (${id(h.kursUsdIdr)})`,
  tanggal,
};
await writeFile(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`emas24 ${id(h.emas24)} Rp/g · perak ${id(h.perak)} Rp/g · kurs ${id(h.kursUsdIdr)} (${h.tanggalKurs}) · ${tanggal}`);
