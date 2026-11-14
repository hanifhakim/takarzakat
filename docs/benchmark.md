# Benchmark Kalkulator Zakat

*Diuji langsung di browser (viewport mobile 390 px), 14 November 2026. Skenario standar: gaji Rp10.000.000/bulan. Screenshot ada di `bench/`.*

## Ringkasan per produk

| # | Produk | Jenis zakat | Hasil gaji 10 jt | Catatan kuat | Catatan lemah |
|---|---|---|---|---|---|
| 1 | **BAZNAS** (baznas.go.id/kalkulatorzakat) | Penghasilan, Perusahaan, Perdagangan, Emas | **Wajib, Rp250.000** (2,5% bruto) | Mencantumkan sumber hukum (QS 2:267, PMA 31/2019, MUI 3/2003, Qaradawi); nisab mengikuti SK terbaru | Nisab/bulan tampil **Rp7.640.114**, padahal SK 15/2026 menyebut **Rp7.640.144** (salah ketik). Field terisi "0" bawaan sehingga mengetik "10000000" menjadi **100.000.000**. Hasil di field abu-abu tanpa status "wajib/tidak" dan tanpa rincian. Di bawah nisab, field hasil hilang tanpa penjelasan. Tidak ada fitrah, tabungan, maupun pertanian |
| 2 | **Dompet Dhuafa** (dompetdhuafa.org/kalkulator-zakat) | Penghasilan, Maal | Wajib, Rp250.000 (modal) | Menyebut sumber; ada tab Maal | Form tertutup satu layar penuh teks. **Harga emas wajib diisi pengguna** dan disertai dua rujukan berbeda (Rp1.078.609/g "SK BAZNAS" vs Rp2.281.134/g "emas dunia") tanpa penjelasan kapan memakai yang mana. Hasil berupa modal tanpa rincian dan langsung "Bayar Zakat Sekarang"; ada tombol donasi sticky |
| 3 | **Rumah Zakat** (rumahzakat.org/kalkulator-zakat) | Penghasilan, Tabungan, Perdagangan, Emas | **Tergantung skema:** Opini DSRZ → **tidak wajib** (nisab Rp17.275.301/bln), tetapi tetap menampilkan "Rp250.000" + "Infaq Sekarang". SK BAZNAS → wajib | **Satu-satunya** yang memberi pilihan skema nisab. Toggle bulanan/tahunan. Catatan "untuk kehati-hatian dipotong dari gaji bruto" | Popup promo aplikasi menutupi kalkulator saat dibuka. Nisab BAZNAS dibulatkan jadi Rp7.640.140 (beda dengan SK). Tidak menjelaskan **kenapa** dua skema beda 2,3× |
| 4 | **NU Care-LAZISNU** (nucare.id/kalkulator-zakat) | 12 kartu (Mal, Pertanian, Perdagangan, Emas/Perak/Perhiasan, Tambak, Saham, Peternakan, Perusahaan, Properti, Pertambangan, Pendapatan & Jasa, Profesi) | **Tidak wajib** (nisab Rp193.513.550/thn, emas 24K real-time; dihitung dari proyeksi tahunan) | **Hasil terbaik:** status jelas, rincian (nisab, harga emas, kadar, rumus, penghasilan bersih, proyeksi tahunan), disclaimer, ajakan infak yang sopan. Harga emas dan perak real-time **dengan waktu update**. Ada input pengeluaran pokok (netto). Ada dark mode. Pertanian memakai pilihan 10%/5% | 12 kartu terlalu banyak; "Profesi" dan "Pendapatan & Jasa" tumpang tindih dengan rumus berbeda (yang satu netto vs nisab tahunan, yang lain "Total × 2,5%" tanpa nisab). Halaman panjang (5.000 px) |
| 5 | **Lazismu** (donasi.lazismu.org/calculator) | Penghasilan, Harta | Tidak wajib (nisab Rp17.729.343/bln, 24K). Gaji 20 jt → wajib Rp500.000 | **Hitung langsung saat mengetik** (tanpa tombol). Ada input "Kebutuhan pokok/utang/cicilan". Toggle bulanan/tahunan | Status "Tidak wajib membayar zakat" berwarna merah sudah muncul **sebelum** pengguna mengisi apa pun. Tanpa rincian rumus. Tanpa fitrah/pertanian |
| 6 | **zakat.or.id** (Dompet Dhuafa, lama) | Penghasilan, Maal | — | Daftar harta maal paling rinci (deposito, logam mulia, surat berharga, properti, kendaraan, koleksi, dagangan, piutang) | **Rusak:** shortcode WordPress mentah (`[su_row]`, `[su_tab ...]`) tampil di halaman. **Nisab usang:** "setara 522 kg beras" (pra-PMA 31/2019). Pengguna diminta mengisi harga beras |
| 7 | **Islamic Relief Australia** | Gabungan aset − utang jangka pendek | (AUD) | Pilihan **Silver Nisab / Gold Nisab** di paling atas. Pemisahan jelas antara "Zakatable assets" dan "Deductible liabilities". Satu angka net assets vs nisab | Satu form panjang (15.800 px) dicampur formulir donasi dan newsletter. *(Islamic Relief UK memblokir akses server, Cloudflare 403)* |
| 8 | **National Zakat Foundation UK** (calculate-ga3.nzf.org.uk) | Kas, piutang, emas/perak, saham, pensiun, ISA, kripto, aset bisnis | (GBP) | **Wizard terbaik:** (1) centang harta yang kamu punya → (2) centang utangmu → hanya isian yang relevan muncul. Progress bar. **Panel ringkas sticky** "Nisab hari ini / Total / Zakat 2,5%" yang ter-update langsung. Toggle **£ ↔ gram** untuk emas. Panduan utang yang sangat jelas ("maksimal 12 bulan porsi non-bunga cicilan KPR; tagihan hanya yang jatuh tempo"). Tombol "Find out more" kontekstual, konsultasi gratis dengan ulama | Hanya untuk aset, tanpa zakat penghasilan/pertanian (konteks UK) |

*Kitabisa tidak diuji karena kalkulatornya hanya ada di aplikasi (Play Store/App Store), bukan web.*

## Temuan kunci (insight)

1. **Satu gaji, tiga jawaban.** Untuk gaji Rp10 juta: BAZNAS dan Dompet Dhuafa → **wajib**; NU Care, Lazismu, dan Rumah Zakat (skema DS) → **tidak wajib**. Penyebabnya bukan salah hitung, melainkan **perbedaan karat emas** (14K BAZNAS vs 24K lainnya) dan **bruto vs netto**. Tidak satu pun kalkulator menjelaskan hal ini dengan kalimat sederhana. → **Ini peluang utama produk kita.**
2. **Hasil tanpa penjelasan = tidak dipercaya.** Hanya NU Care yang menampilkan rumus dan rincian. Sisanya hanya memberi satu angka lalu tombol bayar.
3. **Harga emas adalah titik rawan.** Pengguna diminta mengisi sendiri (Dompet Dhuafa), angkanya usang (zakat.or.id masih 522 kg beras), atau ada salah ketik (BAZNAS). Praktik terbaik: harga terisi otomatis + **sumber + tanggal** + bisa diubah (NU Care).
4. **Input angka sering bermasalah.** Isian "0" bawaan yang tidak terhapus (BAZNAS, Lazismu) dan status merah sebelum input (Lazismu). Perlu: field kosong dengan placeholder, `inputmode="numeric"`, pemformatan ribuan otomatis, dan status netral sebelum diisi.
5. **Kebanyakan pilihan membingungkan, terlalu sedikit pilihan menyesatkan.** NU Care punya 12 kartu yang tumpang tindih, BAZNAS hanya 4 (tanpa fitrah). Jalan tengahnya **5–6 jenis** yang dipahami orang awam, dengan "harta simpanan" sebagai satu gabungan (sesuai PMA 52/2014 Ps. 7 & 10).
6. **Pola wizard NZF unggul untuk zakat maal.** "Centang dulu apa yang kamu punya" membuat form pendek. Panel ringkas sticky (nisab, total, zakat) memberi umpan balik real-time.
7. **Fitrah dan pertanian hampir tidak tersedia.** Hanya NU Care yang punya pertanian, dan tidak ada yang punya kalkulator fitrah, padahal fitrah dicari setiap Ramadan.
8. **Semua kalkulator lembaga = corong donasi.** Popup, tombol donasi sticky, form newsletter. Produk netral tanpa login, tanpa server, dengan daftar lembaga resmi sebagai opsi (bukan paksaan), akan terasa lebih tepercaya.

## Pola yang ditiru vs dihindari

**Tiru:**
- Rincian hasil dan status jelas (NU Care)
- Harga emas otomatis + waktu update (NU Care)
- Pilihan skema nisab (Rumah Zakat), dibuat lebih edukatif
- Hitung langsung tanpa tombol (Lazismu)
- Wizard "centang yang kamu punya" + panel ringkas sticky (NZF)
- Toggle nilai ↔ gram untuk emas (NZF)
- Panduan utang yang konkret (NZF)
- Pilihan nisab emas/perak (Islamic Relief)

**Hindari:**
- Isian "0" bawaan dan status merah sebelum input
- Popup promo di atas kalkulator
- Satu layar teks sebelum form
- Harga emas wajib diisi manual tanpa panduan
- Dua angka rujukan tanpa penjelasan
- Kategori tumpang tindih
- Angka nisab usang atau salah ketik
- Hasil "tidak wajib" yang tetap menampilkan nominal zakat (Rumah Zakat)

## Diferensiasi produk kita

1. **"Kenapa hasilnya beda?"**: satu kartu penjelasan yang membandingkan BAZNAS 14K bruto vs 24K netto dengan angka pengguna sendiri.
2. **Transparansi dalil**: setiap hasil disertai dalil singkat + derajat hadis + tautan sumber (termasuk jujur bahwa hadis Samurah tentang perdagangan dinilai dha'if).
3. **Privat**: semua dihitung di perangkat, tanpa login, tanpa data dikirim ke server.
4. **Lengkap tapi ringkas**: Penghasilan, Simpanan (emas + perak + uang + investasi), Perdagangan, Pertanian, Fitrah.
5. **Netral**: tombol "Tunaikan" mengarah ke daftar lembaga amil resmi (BAZNAS/LAZ berizin), bukan ke satu lembaga.
