# TakarZakat

Kalkulator zakat statis: penghasilan, simpanan & emas, perdagangan, pertanian, dan fitrah. Setiap hasil menampilkan rumus, dalil (dengan derajat hadis), regulasi, dan perbedaan pendapat. Semua dihitung di browser; tidak ada backend, akun, atau data yang dikirim.

> Alat bantu hitung, bukan fatwa.

## Pengembangan

Butuh Node 22 (lihat `.node-version`).

```bash
npm ci
npm test            # Vitest: rumus zakat + validasi data dalil
npm run check       # cek tipe Astro/TS
npm run dev         # http://localhost:4321
npm run build       # output statis ke dist/
npm run verify:dalil  # (butuh internet) cocokkan teks Arab dengan quran.com & sunnah.com
```

## Struktur

```
src/lib/zakat.ts        inti perhitungan (murni, teruji)
src/lib/zakat.test.ts   test case (contoh resmi BAZNAS, batas nisab, khilaf)
src/data/acuan.json     harga emas/perak, nisab BAZNAS, fitrah — SATU-SATUNYA tempat angka yang berubah
src/data/dalil.json     ayat & hadis terverifikasi per jenis zakat
src/pages/              beranda + satu halaman per jenis zakat
docs/                   landasan hukum, benchmark, dan rencana
```

## Memperbarui angka

Edit `src/data/acuan.json` (sertakan sumber + tanggal), lalu commit. Jadwal cek:
- **Januari–Februari:** SK Ketua BAZNAS tentang nisab zakat pendapatan.
- **Sebelum Ramadan:** SK Ketua BAZNAS tentang zakat fitrah.
- **Bulanan:** harga emas & perak.

## Aturan konten

Teks Arab **tidak boleh diketik manual**. Ambil dari sumber (quran.com API / sunnah.com), lalu jalankan `npm run verify:dalil`. Hadis lemah wajib diberi `"lemah": true`.

## Deploy

Cloudflare Pages (proyek `takarzakat`, terhubung ke repo ini): build command `npm run build`, output `dist`, env `NODE_VERSION=22.22.0`. Produksi: https://takarzakat.pages.dev (branch `main`); branch lain mendapat URL preview.

`package-lock.json` harus memakai registry publik (`.npmrc` mengunci `registry.npmjs.org`). Mirror lokal VPS tidak terjangkau dari CI/Cloudflare.
