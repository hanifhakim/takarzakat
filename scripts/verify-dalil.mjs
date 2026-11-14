#!/usr/bin/env node
// Memastikan setiap teks Arab di src/data/dalil.json persis ada di sumbernya
// (quran.com API untuk ayat, halaman sunnah.com untuk hadis). Butuh internet.
// Pakai: npm run verify:dalil
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../src/data/dalil.json', import.meta.url), 'utf8'));
const cache = new Map();

async function teksSumber(d) {
  if (cache.has(d.url)) return cache.get(d.url);
  let teks;
  if (d.tipe === 'ayat') {
    const [, s, a] = d.url.match(/quran\.com\/(\d+)\/(\d+)/);
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${s}:${a}?fields=text_uthmani`);
    if (!res.ok) throw new Error(`quran.com ${res.status}`);
    teks = (await res.json()).verse.text_uthmani;
  } else {
    let res;
    for (let coba = 1; coba <= 4; coba++) {
      res = await fetch(d.url, { headers: { 'user-agent': 'Mozilla/5.0 (verify-dalil)' } });
      if (res.ok) break;
      await new Promise((r) => setTimeout(r, 1500 * coba)); // sunnah.com kadang membatasi (403/429)
    }
    if (!res.ok) throw new Error(`sunnah.com ${res.status}`);
    teks = (await res.text())
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&#(\d+);/g, (_, c) => String.fromCodePoint(+c))
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ');
  }
  cache.set(d.url, teks);
  return teks;
}

let gagal = 0, total = 0;
for (const [jenis, isi] of Object.entries(data.jenis)) {
  for (const d of isi.dalil) {
    total++;
    const potongan = d.ar.split('…').map((x) => x.trim()).filter(Boolean);
    try {
      const sumber = await teksSumber(d);
      const hilang = potongan.filter((p) => !sumber.includes(p));
      if (hilang.length) { gagal++; console.log(`GAGAL  ${jenis} · ${d.rujukan}\n       tidak ditemukan: ${hilang[0].slice(0, 60)}…`); }
      else console.log(`ok     ${jenis} · ${d.rujukan}`);
    } catch (e) {
      gagal++; console.log(`ERROR  ${jenis} · ${d.rujukan}: ${e.message}`);
    }
  }
}
console.log(`\n${total - gagal}/${total} cocok dengan sumber`);
process.exit(gagal ? 1 : 0);
