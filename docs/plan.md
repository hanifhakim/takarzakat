# Rencana Pembuatan: TakarZakat

*14 November 2026. Nama: TakarZakat. Hosting: Cloudflare Pages. Prinsip: sederhana, gratis, tidak over-engineering.*

## 1. Tujuan & pengguna

**Tujuan:** muslim Indonesia bisa menghitung zakatnya dalam kurang dari 1 menit, paham **kenapa** angkanya begitu, dan tahu bahwa ada perbedaan pendapat, tanpa harus login atau dibujuk berdonasi.

**Pengguna utama:**
1. Karyawan/ASN yang bingung apakah gajinya wajib zakat (kasus terbanyak, terutama soal BAZNAS 14K vs 24K).
2. Keluarga yang menghitung zakat tahunan (tabungan + emas).
3. Pedagang kecil dan petani.
4. Semua orang menjelang Idulfitri (fitrah).

**Ukuran berhasil (sederhana):** halaman cepat (LCP < 1,5 dtk di 4G), skor Lighthouse ≥ 95 untuk semua kategori, dan nol laporan salah hitung setelah review ustadz.

## 2. Ruang lingkup

**MVP (v1):**
- 5 kalkulator: penghasilan (BAZNAS / bersih, bulanan / tahunan), simpanan & emas (gabungan, perhiasan opsional, basis emas/perak, haul), perdagangan, pertanian (padi / tanaman lain, 10% / 5%), fitrah (2,5 / 2,75 kg; beras / uang BAZNAS / uang lokal).
- Kartu "Kenapa hasil bisa berbeda?" di penghasilan.
- Dalil + derajat hadis + regulasi per jenis (konten dari `riset/landasan-hukum.md`).
- Harga acuan dengan tanggal dan sumber, bisa diubah pengguna (disimpan di `localStorage`).
- Salin rincian, tema gelap, mobile-first, dan dapat dipakai offline setelah kunjungan pertama.
- Halaman "Tentang & metodologi" + disclaimer + daftar lembaga amil resmi (tanpa afiliasi).

**Nanti (v2+), hanya jika ada permintaan:**
- Pengingat haul (file .ics ke kalender, tetap tanpa server).
- Halaman informasi peternakan (tabel unta/sapi/kambing), rikaz.
- Pilihan karat untuk nisab penghasilan (bukan hanya 14K/24K).
- Bahasa Inggris.
- Ekspor PDF rincian.

**Sengaja TIDAK dibuat:** akun/login, database, backend, pembayaran/donasi, chatbot, aplikasi native.

## 3. Arsitektur

```
GitHub repo (hanifhakim/takarzakat)
   └─ push ke main → build statis → Cloudflare Pages / GitHub Pages (gratis)
Browser pengguna
   └─ HTML pra-render per jenis zakat (SEO) + JS kecil untuk kalkulator
      └─ data: acuan.json (harga, nisab), dalil.json (ayat/hadis terverifikasi)
      └─ tidak ada request data pengguna ke server mana pun
```

Semua hitungan terjadi di browser. Yang dikirim server hanya file statis.

## 4. Pilihan stack

| | **A. Astro (output statis) + TypeScript** | **B. HTML + JS vanilla tanpa build** |
|---|---|---|
| SEO per halaman | Setiap jenis zakat otomatis jadi halaman HTML penuh (`/zakat-penghasilan`, …) dengan judul, konten, dan dalil | Harus menyalin kerangka HTML manual per halaman |
| JS yang dikirim | Hanya untuk kalkulator (island), sekitar 10–15 KB | Sama kecilnya |
| Konten dalil | Diambil dari JSON saat build, sekali tulis | Di-inline manual atau di-fetch saat runtime |
| Kompleksitas | Ada `npm`, build ~5 detik | Paling sederhana |
| Pemeliharaan 2+ tahun | Layout dan komponen dipakai bersama | Duplikasi kode jadi utang |

**Pilihan: A, Astro statis + TypeScript, tanpa React.** Alasannya: lalu lintas utama akan datang dari pencarian ("kalkulator zakat penghasilan 2026", "nisab zakat emas 2026"), jadi halaman pra-render per jenis sangat penting. Logika hitung tetap modul TS murni (port dari `mockup/src/zakat-core.js`) yang diuji dengan **Vitest**. Tidak ada framework UI; interaksi cukup memakai vanilla TS seperti di mockup.

**Catatan lingkungan:** Node di VPS adalah v18, padahal Astro versi terbaru butuh Node yang lebih baru. Pakai Node 22 portable untuk build lokal; build produksi dijalankan di CI (GitHub Actions / Cloudflare Pages) dengan Node 22.

**Hosting (gratis, tanpa kartu kredit):**
- *Opsi 1 (paling mudah):* **GitHub Pages** via GitHub Actions. `gh` sudah login sebagai hanifhakim.
- *Opsi 2:* **Cloudflare Pages** yang terhubung ke repo GitHub. Lebih cepat di Indonesia dan dapat Cloudflare Web Analytics gratis. Token Cloudflare yang ada sekarang belum punya izin Pages, jadi pengaturan awal dilakukan lewat dashboard oleh Hanif (sekali saja).
- Domain: subdomain gratis dulu (`takarzakat.pages.dev`); domain sendiri opsional.

## 5. Struktur halaman & komponen

```
/                         Beranda: pilih jenis + harga acuan
/zakat-penghasilan        Kalkulator + konten edukasi + FAQ
/zakat-simpanan-emas
/zakat-perdagangan
/zakat-pertanian
/zakat-fitrah
/metodologi               Sumber, cara hitung, khilaf, siapa yang mereview, tanggal update
```

Komponen (sedikit dan dipakai ulang): `MoneyInput`, `GramInput`, `Segmented`, `Chips`, `Stepper`, `ResultCard` (status + angka + meter nisab + rincian + rumus), `CompareCard`, `DalilList`, `AcuanDialog`, `LembagaDialog`, `Dock` (ringkasan sticky di mobile).

## 6. Model data

**`src/data/acuan.json`**: satu-satunya tempat angka yang berubah.
```json
{
  "diperbarui": "2026-11-13",
  "emas24": { "nilai": 2509000, "sumber": "Logam Mulia (harga jual)", "url": "…", "tanggal": "2026-11-13" },
  "perak":  { "nilai": 34300,   "sumber": "Logam Mulia", "url": "…", "tanggal": "2026-11-13" },
  "nisabPenghasilanBaznas": { "tahun": 91681728, "bulan": 7640144, "dasar": "SK Ketua BAZNAS 15/2026", "url": "…" },
  "fitrahBaznas": { "nilai": 50000, "dasar": "SK Ketua BAZNAS 14/2026", "url": "…" },
  "gabahKg": { "nilai": 6500, "sumber": "HPP gabah 2026" },
  "berasKg": { "nilai": 20000, "catatan": "turunan Rp50.000 / 2,5 kg" }
}
```

**`src/data/dalil.json`**: konten terverifikasi, setiap entri wajib punya sumber.
```json
{ "id": "bukhari-1483", "jenis": ["pertanian"], "tipe": "hadis",
  "ar": "…", "terjemah": "…", "rujukan": "HR Bukhari 1483", "url": "https://sunnah.com/bukhari:1483",
  "derajat": "Sahih", "diverifikasi": "2026-11-14", "catatan": null }
```
Aturan: **teks Arab tidak boleh diketik tangan.** Selalu ambil dari quran.com API / sunnah.com lewat skrip (seperti `mockup/build.py`). Waktu mockup dibuat, teks yang diketik ulang terbukti berbeda Unicode dari sumbernya.

**Cara memperbarui harga emas:**
1. **Manual (cukup untuk v1):** edit `acuan.json`, commit, lalu deploy otomatis. Cukup sebulan sekali, plus setiap ada SK BAZNAS baru (nisab penghasilan biasanya Jan–Feb, fitrah menjelang Ramadan).
2. **Otomatis (opsional, v1.1):** GitHub Action terjadwal mingguan yang mengambil harga emas dari sumber gratis lalu membuka PR (bukan langsung merge). Catatan: logammulia.com memblokir akses dari server saat riset, jadi sumber otomatis yang andal **harus diuji dulu**. Kalau tidak ada, tetap manual.
3. UI selalu menampilkan **tanggal harga** dan tetap bisa diubah pengguna, jadi angka yang sedikit usang tidak menyesatkan.

## 7. Rumus & test case wajib

Rumus mengikuti `riset/landasan-hukum.md`. Test suite mockup (`mockup/test/core.test.js`, **32 tes, lulus**) dipindah ke Vitest. Tes yang wajib ada:

- **Penghasilan BAZNAS:** contoh resmi BAZNAS (10 jt/bln → Rp250.000; 120 jt/thn → Rp3.000.000), tepat di nisab (Rp7.640.144 → wajib), Rp1 di bawah nisab (tidak wajib), bruto tidak terpengaruh kebutuhan pokok.
- **Penghasilan bersih:** nisab bulanan = 85 × harga emas ÷ 12, kebutuhan pokok lebih besar dari gaji tidak menghasilkan angka negatif, contoh Muhammadiyah (bersih 22,8 jt/thn → tidak wajib).
- **Simpanan:** nisab 85 g, contoh BAZNAS (100 g @Rp2 jt → Rp5 jt), harta digabung (uang + emas mencapai nisab walau masing-masing belum), belum haul, perhiasan default tidak dihitung, perhiasan 18K, basis perak 595 g, utang lebih besar dari harta.
- **Perdagangan:** aset lancar − utang jangka pendek, kasus di bawah nisab.
- **Pertanian:** 10% / 5%, batas 653 kg (wajib) vs 652 kg (tidak), tanaman lain dinilai uang, tanaman lain tanpa harga.
- **Fitrah:** 4 jiwa × 2,5 kg; 2,75 kg × harga lokal; 0 jiwa.
- **Format:** rupiah, desimal koma, pemisah ribuan.

Tambahan untuk v1: **tes snapshot konten**, yaitu setiap teks Arab di `dalil.json` harus identik dengan sumbernya (skrip verifikasi otomatis berjalan di CI).

## 8. Aksesibilitas

- Label nyata untuk setiap input; `inputmode="numeric"`/`"decimal"`; tidak ada isian "0" bawaan (masalah BAZNAS dan Lazismu).
- Hasil diumumkan lewat `aria-live="polite"`; status tidak hanya bergantung pada warna (ada teks "Wajib zakat"/"Belum wajib").
- Target sentuh ≥ 44 px, fokus terlihat, kontras teks ≥ 4,5:1 (diperiksa untuk tema terang dan gelap).
- Teks Arab memakai `lang="ar"` + `dir="rtl"`, font Amiri **di-host sendiri** (bukan Google Fonts) supaya tidak bocor ke pihak ketiga dan tidak tampil kotak.
- `prefers-reduced-motion` dihormati.

## 9. SEO dasar

- Satu halaman per jenis zakat: `<title>` dan `<meta description>` unik, H1 jelas, konten edukasi ringkas di bawah kalkulator (nisab 2026, cara hitung, dalil, FAQ).
- JSON-LD: `WebApplication` (beranda) + `FAQPage` (per jenis).
- `sitemap.xml`, `robots.txt`, OG image statis per jenis.
- Kata kunci musiman: halaman fitrah diperbarui sebelum Ramadan (angka tahun di judul).

## 10. Analitik (opsional, ramah privasi)

Pakai **Cloudflare Web Analytics** (gratis, tanpa cookie) jika hosting di Cloudflare Pages, atau tidak pakai analitik sama sekali. **Jangan pernah** mengirim angka hitungan pengguna. Yang boleh dihitung hanya kunjungan halaman.

## 11. Milestone

| Hari | Pekerjaan | Hasil |
|---|---|---|
| 1 | Repo `takarzakat`, Astro + TS + Vitest, port `zakat-core` + 32 tes, CI (test + build) | Build hijau di CI |
| 2 | Layout, design token (dari mockup), komponen input, beranda, halaman penghasilan lengkap | Penghasilan berfungsi end-to-end |
| 3 | Simpanan, perdagangan, pertanian, fitrah + `dalil.json` + skrip verifikasi teks Arab | 5 kalkulator berfungsi |
| 4 | Metodologi, SEO (meta, JSON-LD, sitemap), tema gelap, offline (service worker sederhana), aksesibilitas + Lighthouse | Skor ≥ 95 |
| 5 | Deploy ke GitHub Pages / Cloudflare Pages, uji di HP Android murah + iPhone, perbaikan | URL publik (beta) |
| +1–2 minggu | **Review syariah** oleh ustadz/amil (lihat §13), revisi konten | Rilis v1 |

Estimasi di atas berlaku untuk satu orang dengan bantuan agent. Hari 1–3 sebagian besar adalah port langsung dari mockup.

## 12. Risiko & mitigasi

| Risiko | Mitigasi |
|---|---|
| **Akurasi fiqih** (salah dalil, salah derajat hadis) | Teks diambil otomatis dari sumber, derajat ditampilkan, review ustadz sebelum rilis, halaman metodologi mencantumkan nama reviewer dan tanggal |
| **Perbedaan mazhab dianggap memihak** | Tampilkan pilihan dengan bahasa netral, default mengikuti regulasi resmi (BAZNAS/PMA), dan selalu tampilkan perbandingan |
| **Harga emas usang** | Tanggal selalu tampil, bisa diubah pengguna, ada kalender update; nisab penghasilan BAZNAS tidak bergantung harga harian (ditetapkan SK tahunan) |
| **SK BAZNAS baru terlewat** | Pengingat tahunan (Januari dan sebelum Ramadan) untuk cek SK nisab dan fitrah |
| **Salah hitung karena bug** | 32+ tes unit, uji kasus batas (tepat nisab, Rp1 di bawah), tes konten di CI |
| **Disalahpahami sebagai fatwa** | Disclaimer di setiap hasil + "tanyakan kepada ustadz/amil" |
| **Lembaga di daftar "Tunaikan" dianggap afiliasi** | Label "tanpa afiliasi", hanya lembaga berizin, tautan ke situs resmi |

## 13. Review syariah sebelum rilis

Minta 1–2 reviewer, misalnya ustadz di lingkungan kampus/masjid dan amil BAZNAS daerah, untuk memeriksa:
1. Ringkasan hukum per jenis (`/metodologi`).
2. Teks kartu "Kenapa hasil bisa berbeda?".
3. Default yang dipilih (BAZNAS untuk penghasilan, emas untuk nisab, 2,5 kg untuk fitrah, perhiasan tidak dihitung).
4. Hal yang masih **belum terverifikasi**: PMA 31/2019 dari teks asli, kadar 7,5% pertanian campuran, pengurangan biaya produksi pertanian, rincian utang yang boleh dikurangi, dan atsar sahabat tentang zakat perdagangan.

Catat nama, tanggal, dan catatan reviewer di halaman metodologi.

## 14. Keputusan yang perlu Hanif ambil

1. Nama: "Takar" atau usulan lain?
2. Hosting: GitHub Pages (paling cepat dimulai) atau Cloudflare Pages (lebih cepat di Indonesia, analitik gratis)?
3. Siapa reviewer syariahnya?
