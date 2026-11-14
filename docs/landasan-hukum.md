# Landasan Hukum Zakat untuk Kalkulator Zakat

*Riset ulang (Opus), 14 November 2026. Ayat diambil dari API quran.com (teks Utsmani + terjemahan Kemenag RI). Hadis dicek satu per satu di sunnah.com beserta derajatnya. Regulasi dibaca dari dokumen asli (PDF BAZNAS/Kemenag/MUI). Semua salinan sumber ada di `riset/sumber/`.*

> **Disclaimer produk:** kalkulator adalah alat bantu hitung, bukan fatwa. Bila ragu, pengguna diarahkan bertanya kepada ustadz atau lembaga amil resmi.

---

## 0. Ringkasan cepat (yang dipakai kalkulator)

| Jenis | Nisab | Kadar | Haul | Acuan utama |
|---|---|---|---|---|
| Penghasilan (profesi) | 85 g emas. BAZNAS 2026: **Rp91.681.728/tahun = Rp7.640.144/bulan** (emas 14K) | 2,5% | Tidak (dibayar saat terima) menurut PMA/MUI/BAZNAS; **ya** menurut jumhur 4 mazhab | PMA 31/2019, Fatwa MUI 3/2003, SK BAZNAS 15/2026 |
| Emas | 85 g | 2,5% | 1 tahun hijriah | PMA 52/2014 ps. 4, HR Abu Dawud 1573 |
| Perak | 595 g | 2,5% | 1 tahun | PMA 52/2014 ps. 5, HR Bukhari 1405 |
| Uang, tabungan, surat berharga | setara 85 g emas (digabung dengan emas/perak) | 2,5% | 1 tahun | PMA 52/2014 ps. 7–10 |
| Perdagangan | setara 85 g emas | 2,5% dari (aset lancar − utang jangka pendek) | 1 tahun | PMA 52/2014 ps. 11–13 |
| Pertanian | 653 kg gabah (≈ 5 wasaq) | 10% tadah hujan / 5% irigasi berbiaya | Tidak (saat panen) | HR Bukhari 1483 & 1405, PMA 52/2014 ps. 14 |
| Fitrah | Tidak ada nisab harta; wajib bagi yang punya kelebihan makanan di malam/hari Id | 1 sha' ≈ **2,5 kg / 3,5 liter beras** per jiwa; BAZNAS 2026: **Rp50.000/jiwa** | Ramadan s.d. sebelum salat Id | HR Bukhari 1503, Abu Dawud 1609, PMA 52/2014 ps. 30–31 |
| Rikaz (harta temuan) | Tanpa nisab | 20% (1/5) | Tidak | HR Bukhari 1499, PMA 52/2014 ps. 28 |

**Data harga (diambil 14 Nov 2026, untuk default kalkulator; pengguna bisa mengubah):**
- Emas Antam 24K: **Rp2.509.000/g** (harga jual Logam Mulia, 13 Nov 2026; buyback Rp2.285.000), sumber [NTV News](https://www.ntvnews.id/ekonomi/01125853/harga-emas-antam-hari-ini-turun-lagi-ke-level-rp25-juta-per-gram) mengutip logammulia.com. Situs logammulia.com sendiri memblokir akses dari server ini (403).
- → Nisab 85 g × Rp2.509.000 = **Rp213.265.000** (untuk emas/uang/perdagangan).
- Perak Antam: **Rp34.300/g** (13 Nov 2026), sumber [Liputan6](https://www.liputan6.com/bisnis/read/8334426/harga-perak-antam-hari-ini-13-november-2026-merosot-rp-900). → Nisab 595 g ≈ **Rp20.408.500**.
- Gabah: HPP gabah kering panen **Rp6.500/kg** (Kompas, 2026). → 653 kg ≈ Rp4.244.500 (hanya untuk tanaman non-padi yang dinilai dengan uang).
- Beras fitrah: Rp50.000 ÷ 2,5 kg = **Rp20.000/kg** (turunan dari angka BAZNAS).

Catatan penting: harga jual Antam sudah termasuk premi produk, jadi nisab berbasis harga itu sedikit lebih tinggi daripada nisab berbasis harga spot emas murni. Kalkulator menampilkan sumber dan tanggal harga, dan pengguna boleh menggantinya.

---

## 1. Dalil umum kewajiban zakat

> وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ
>
> *"Dan laksanakanlah salat, tunaikanlah zakat dan rukuklah beserta orang yang rukuk."* (QS Al-Baqarah [2:43])

> خُذْ مِنْ أَمْوَٰلِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَوٰتَكَ سَكَنٌ لَّهُمْ ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ
>
> *"Ambillah zakat dari harta mereka, guna membersihkan dan menyucikan mereka, dan berdoalah untuk mereka. Sesungguhnya doamu itu (menumbuhkan) ketenteraman jiwa bagi mereka. Allah Maha Mendengar, Maha Mengetahui."* (QS At-Taubah [9:103])

> وَفِىٓ أَمْوَٰلِهِمْ حَقٌّ لِّلسَّآئِلِ وَٱلْمَحْرُومِ
>
> *"Dan pada harta benda mereka ada hak untuk orang miskin yang meminta, dan orang miskin yang tidak meminta."* (QS Adz-Dzariyat [51:19])

**Hadis Mu'adz ke Yaman** (HR Bukhari 1395, sahih): Nabi ﷺ memerintahkan Mu'adz mengajarkan bahwa *"Allah mewajibkan zakat pada harta mereka, diambil dari orang kaya mereka dan dikembalikan kepada orang fakir mereka."* [sunnah.com/bukhari:1395](https://sunnah.com/bukhari:1395)

**Penerima zakat (8 asnaf)**, untuk konten edukasi di halaman hasil:

> ۞ إِنَّمَا ٱلصَّدَقَـٰتُ لِلْفُقَرَآءِ وَٱلْمَسَـٰكِينِ وَٱلْعَـٰمِلِينَ عَلَيْهَا وَٱلْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِى ٱلرِّقَابِ وَٱلْغَـٰرِمِينَ وَفِى سَبِيلِ ٱللَّهِ وَٱبْنِ ٱلسَّبِيلِ ۖ فَرِيضَةً مِّنَ ٱللَّهِ ۗ وَٱللَّهُ عَلِيمٌ حَكِيمٌ
>
> *"Sesungguhnya zakat itu hanyalah untuk orang-orang fakir, orang miskin, amil zakat, orang yang dilunakkan hatinya (mualaf), untuk (memerdekakan) hamba sahaya, untuk (membebaskan) orang yang berhutang, untuk jalan Allah dan untuk orang yang sedang dalam perjalanan, sebagai kewajiban dari Allah. Allah Maha Mengetahui, Mahabijaksana."* (QS At-Taubah [9:60])

**Syarat harta yang dizakati** (PMA 52/2014 Pasal 2): milik penuh, halal, cukup nisab, dan haul. Syarat haul **tidak berlaku** untuk pertanian/perkebunan/kehutanan, perikanan, pendapatan dan jasa, serta rikaz. Himpunan Fatwa MUI (Ijtima' 2018) menambahkan dua syarat: harta itu **lebih dari kebutuhan pokok** (*al-hajah al-ashliyyah*) dan **bebas dari utang**.

**Haul**: *"Tidak ada zakat pada harta sampai berlalu satu tahun"* (HR Ibnu Majah 1792 dari Aisyah, **hasan** menurut Darussalam). Riwayat Ibnu Umar di Tirmidzi 632 dinilai lebih kuat oleh Tirmidzi sendiri sebagai **mauquf** (perkataan Ibnu Umar); jalur marfu'-nya (Tirmidzi 631) **dha'if**. PMA mendefinisikan haul sebagai 1 tahun hijriah (12 bulan qamariyah).

---

## 2. Zakat penghasilan (profesi / *al-mal al-mustafad*)

### Dalil yang digunakan para pendukung
> يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَنفِقُوا۟ مِن طَيِّبَـٰتِ مَا كَسَبْتُمْ وَمِمَّآ أَخْرَجْنَا لَكُم مِّنَ ٱلْأَرْضِ ۖ وَلَا تَيَمَّمُوا۟ ٱلْخَبِيثَ مِنْهُ تُنفِقُونَ وَلَسْتُم بِـَٔاخِذِيهِ إِلَّآ أَن تُغْمِضُوا۟ فِيهِ ۚ وَٱعْلَمُوٓا۟ أَنَّ ٱللَّهَ غَنِىٌّ حَمِيدٌ
>
> *"Wahai orang-orang yang beriman! Infakkanlah sebagian dari hasil usahamu yang baik-baik dan sebagian dari apa yang Kami keluarkan dari bumi untukmu. Janganlah kamu memilih yang buruk untuk kamu keluarkan, padahal kamu sendiri tidak mau mengambilnya melainkan dengan memicingkan mata (enggan) terhadapnya. Dan ketahuilah bahwa Allah Mahakaya, Maha Terpuji."* (QS Al-Baqarah [2:267])

Kata *mā kasabtum* ("hasil usahamu") dipahami MUI mencakup gaji, upah, honor, dan jasa profesi.

> ۞ يَسْـَٔلُونَكَ عَنِ ٱلْخَمْرِ وَٱلْمَيْسِرِ ۖ قُلْ فِيهِمَآ إِثْمٌ كَبِيرٌ وَمَنَـٰفِعُ لِلنَّاسِ وَإِثْمُهُمَآ أَكْبَرُ مِن نَّفْعِهِمَا ۗ وَيَسْـَٔلُونَكَ مَاذَا يُنفِقُونَ قُلِ ٱلْعَفْوَ ۗ كَذَٰلِكَ يُبَيِّنُ ٱللَّهُ لَكُمُ ٱلْـَٔايَـٰتِ لَعَلَّكُمْ تَتَفَكَّرُونَ
>
> *"Mereka menanyakan kepadamu (Muhammad) tentang khamar dan judi. Katakanlah, "Pada keduanya terdapat dosa besar dan beberapa manfaat bagi manusia. Tetapi dosanya lebih besar daripada manfaatnya." Dan mereka menanyakan kepadamu (tentang) apa yang (harus) mereka infakkan. Katakanlah, "Kelebihan (dari apa yang diperlukan)." Demikianlah Allah menerangkan ayat-ayat-Nya kepadamu agar kamu memikirkan,"* (QS Al-Baqarah [2:219])

Ayat ini menjadi dasar MUI untuk menghitung zakat dari **kelebihan setelah kebutuhan pokok** (*al-'afw*).

### Ketentuan resmi Indonesia
- **Fatwa MUI No. 3/2003** (ditetapkan 7 Juni 2003), dibaca dari *Himpunan Fatwa Zakat MUI 1976–2021*:
  - Hukum: semua penghasilan halal wajib dizakati bila mencapai nisab **dalam satu tahun**, yaitu senilai **85 g emas**.
  - Waktu: (1) boleh dikeluarkan **saat menerima** bila sudah cukup nisab; (2) bila tidak cukup nisab, penghasilan **dikumpulkan selama satu tahun**, lalu dizakati bila **penghasilan bersihnya** cukup nisab.
  - Kadar: 2,5%.
- **Ijtima' Ulama Komisi Fatwa MUI VI 2018** (dimuat di himpunan yang sama, hlm. 87–88): yang dizakati adalah **penghasilan bersih**, yaitu penghasilan setelah dikurangi **kebutuhan pokok** (sandang, pangan, papan, serta kebutuhan tanggungan termasuk kesehatan dan pendidikan), berdasarkan standar Kebutuhan Hidup Minimum. MUI meminta pemerintah menetapkan *Penghasilan Tidak Kena Zakat (PTKZ)*. ([ringkasan MUI Digital, Juli 2026](https://mui.or.id/public/baca/bimbingan/siapa-yang-wajib-membayar-zakat-penghasilan-simak-penjelasan-putusan-ijtima-ulama-mui-tahun-2018-6a635e5b8a247))
- **PMA 52/2014 Pasal 26–27**: nisab awal 653 kg gabah / 524 kg beras, kadar 2,5%, ditunaikan saat penghasilan diterima. **PMA 31/2019** (perubahan kedua) mengganti nisab menjadi **setara 85 g emas** tanpa menyebut kadar karat, sebagaimana dikutip SK BAZNAS 15/2026 dan kajian BAZNAS.
- **SK Ketua BAZNAS No. 15/2026** (PDF asli): nisab 2026 = **85 g emas ≈ Rp91.681.728/tahun atau Rp7.640.144/bulan**. Menurut kajian BAZNAS, angka ini memakai **emas 14 karat** (kandungan emas murni 58–62%) dan harga rata-rata emas 2025. Dasarnya: mazhab Hanafi (*al-hukmu lil-ghalib*, kadar emas di atas 50% tetap dihukumi emas) dan Maliki (*rawaj*, beredar luas di pasar). Mazhab Syafi'i dan Hanbali memakai emas murni.
- **Cara hitung BAZNAS**: *2,5% × jumlah penghasilan dalam 1 bulan* bila penghasilan bulanan ≥ Rp7.640.144. Contoh di situs BAZNAS: gaji Rp10 juta → Rp250.000/bulan. Jadi BAZNAS memakai penghasilan **kotor (bruto)**. ([baznas.go.id/zakatpenghasilan](https://baznas.go.id/zakatpenghasilan))

### Perbedaan pendapat yang harus terlihat di UI
| Pandangan | Dasar hitung | Nisab | Kapan dibayar |
|---|---|---|---|
| **BAZNAS (praktik resmi)** | Bruto per bulan | Rp7.640.144/bulan (14K) | Setiap terima gaji |
| **MUI 2003 + Ijtima' 2018** | **Netto** (setelah kebutuhan pokok) | 85 g emas/tahun (karat tidak ditetapkan) | Saat terima, atau diakumulasi setahun |
| **Muhammadiyah (Munas Tarjih XXV, 2000)** | Netto (setelah kebutuhan hidup wajar) | 85 g **emas 24K**, dihitung dari penghasilan bersih 12 bulan | Setelah dihitung tahunan; boleh dicicil ([muhammadiyah.or.id](https://muhammadiyah.or.id/2021/05/zakat-penghasilan-atau-zakat-profesi-wajib-berikut-penjelasan-muhammadiyah/)) |
| **Jumhur 4 mazhab (dirujuk NU Online)** | Tidak ada zakat khusus penghasilan; gaji yang tersimpan menjadi **zakat uang** | Nisab emas/perak; NU Online memakai **77,5 g emas** atau 543,35 g perak | Setelah haul 1 tahun ([NU Online](https://islam.nu.or.id/bahtsul-masail/kedudukan-zakat-profesi-pns-ffTYD)). Al-Zuhaili: *"وَالْمُقَرَّرُ فِيْ الْمَذَاهِبِ الْأَرْبَعَةِ أَنَّهُ لَا زَكَاةَ فِي الْمَالِ الْمُسْتَفَادِ حَتَّى يَبْلُغَ نِصَاباً وَيَتِمَّ حَوْلاً"* |

NU Online juga mencatat bahwa ulama kontemporer (Al-Qaradawi, Abu Zahrah, Khallaf, Al-Zuhaili, Majma' Fiqh) dan MUI mewajibkan zakat penghasilan, merujuk pada pendapat sebagian sahabat (Ibnu Abbas, Ibnu Mas'ud, Mu'awiyah) dan Umar bin Abdul Aziz. ([NU Online, cara menghitung zakat profesi](https://islam.nu.or.id/syariah/cara-menghitung-zakat-profesi-mVtXT))

**Keputusan produk:** default memakai **metode BAZNAS** karena itu angka resmi yang paling banyak dipakai lembaga. Pengguna bisa beralih dengan satu tap ke **Netto (MUI/Muhammadiyah)** atau **Tahunan**. Untuk pengikut pendapat jumhur, ada tautan "Saya ikut pendapat jumhur → hitung sebagai zakat tabungan".

---

## 3. Zakat emas, perak, uang, dan tabungan (harta simpanan)

> ۞ يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِنَّ كَثِيرًا مِّنَ ٱلْأَحْبَارِ وَٱلرُّهْبَانِ لَيَأْكُلُونَ أَمْوَٰلَ ٱلنَّاسِ بِٱلْبَـٰطِلِ وَيَصُدُّونَ عَن سَبِيلِ ٱللَّهِ ۗ وَٱلَّذِينَ يَكْنِزُونَ ٱلذَّهَبَ وَٱلْفِضَّةَ وَلَا يُنفِقُونَهَا فِى سَبِيلِ ٱللَّهِ فَبَشِّرْهُم بِعَذَابٍ أَلِيمٍ
>
> *"Wahai orang-orang yang beriman! Sesungguhnya banyak dari orang-orang alim dan rahib-rahib mereka benar-benar memakan harta orang dengan jalan yang batil, dan (mereka) menghalang-halangi (manusia) dari jalan Allah. Dan orang-orang yang menyimpan emas dan perak dan tidak menginfakkannya di jalan Allah, maka berikanlah kabar gembira kepada mereka, (bahwa mereka akan mendapat) azab yang pedih."* (QS At-Taubah [9:34])

> يَوْمَ يُحْمَىٰ عَلَيْهَا فِى نَارِ جَهَنَّمَ فَتُكْوَىٰ بِهَا جِبَاهُهُمْ وَجُنُوبُهُمْ وَظُهُورُهُمْ ۖ هَـٰذَا مَا كَنَزْتُمْ لِأَنفُسِكُمْ فَذُوقُوا۟ مَا كُنتُمْ تَكْنِزُونَ
>
> *"(Ingatlah) Pada hari ketika emas dan perak di panaskan dalam neraka Jahanam, lalu dengan itu disetrika dahi, lambung dan punggung mereka (seraya dikatakan) kepada mereka, "Inilah harta bendamu yang kamu simpan untuk dirimu sendiri, maka rasakanlah (akibat dari) apa yang kamu simpan itu.""* (QS At-Taubah [9:35])

**HR Abu Dawud 1573** dari Ali bin Abi Thalib, **sahih** (Al-Albani):
> فَإِذَا كَانَتْ لَكَ مِائَتَا دِرْهَمٍ وَحَالَ عَلَيْهَا الْحَوْلُ فَفِيهَا خَمْسَةُ دَرَاهِمَ وَلَيْسَ عَلَيْكَ شَىْءٌ - يَعْنِي فِي الذَّهَبِ - حَتَّى يَكُونَ لَكَ عِشْرُونَ دِينَارًا فَإِذَا كَانَ لَكَ عِشْرُونَ دِينَارًا وَحَالَ عَلَيْهَا الْحَوْلُ فَفِيهَا نِصْفُ دِينَارٍ فَمَا زَادَ فَبِحِسَابِ ذَلِكَ
>
> "Jika engkau memiliki 200 dirham dan telah berlalu satu tahun, zakatnya 5 dirham. Tidak ada kewajiban atas emas sampai engkau memiliki 20 dinar; jika telah 20 dinar dan berlalu satu tahun, zakatnya setengah dinar. Selebihnya dihitung sesuai itu." [sunnah.com/abudawud:1573](https://sunnah.com/abudawud:1573)

**HR Bukhari 1405** dari Abu Sa'id (sahih):
> لَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ، وَلَيْسَ فِيمَا دُونَ خَمْسِ ذَوْدٍ صَدَقَةٌ، وَلَيْسَ فِيمَا دُونَ خَمْسِ أَوْسُقٍ صَدَقَةٌ
>
> "Tidak ada zakat pada (perak) di bawah 5 uqiyah, pada (unta) di bawah 5 ekor, dan pada (hasil bumi) di bawah 5 wasaq." [sunnah.com/bukhari:1405](https://sunnah.com/bukhari:1405) (5 uqiyah = 200 dirham.)

**HR Muslim 987** (Abu Hurairah): ancaman bagi pemilik emas dan perak yang tidak menunaikan haknya. [sunnah.com/muslim:987a](https://sunnah.com/muslim:987a)

**Konversi ke gram:** 20 dinar → **85 g** (asumsi 1 dinar = 4,25 g; dipakai Al-Qaradawi, PMA, dan BAZNAS) atau **77,5 g** (1 dinar = 3,875 g; dipakai NU Online). 200 dirham → **595 g** perak (PMA) atau 543,35 g (NU Online).

**Ketentuan PMA 52/2014:**
- Ps. 4–6: emas 85 g, perak 595 g, logam mulia lain setara 85 g emas; kadar 2,5%.
- Ps. 7 & 10: ditunaikan setelah haul, dan kepemilikan emas, perak, logam mulia, uang, dan surat berharga **dihitung gabungan** terhadap nisab 85 g emas.
- Ps. 8–9: uang dan surat berharga, nisab 85 g emas, 2,5%.

**Khilaf perhiasan yang dipakai** ([NU Online](https://islam.nu.or.id/zakat/apakah-perhiasan-yang-dipakai-wajib-dikeluarkan-zakatnya-yM479), [NU Online: nishab emas & perak](https://islam.nu.or.id/syariah/nishab-zakat-emas-dan-perak-g7Rub)):
- Syafi'i, Maliki, Hanbali: perhiasan halal yang **dipakai secara wajar** tidak wajib zakat.
- Hanafi: tetap wajib zakat. Dalilnya hadis perempuan dengan gelang emas anaknya (HR Abu Dawud), yang kehujjahannya diperselisihkan ulama.
- → Di UI: toggle "Sertakan perhiasan yang dipakai sehari-hari?" dengan default **tidak** dan penjelasan singkat.

**Kebutuhan dan utang:** utang jatuh tempo dikurangkan dari harta sebelum dibandingkan dengan nisab, sesuai syarat "bebas dari utang" di Ijtima' MUI 2018. Detail khilaf soal jenis utang yang boleh dikurangi (cicilan KPR jangka panjang, misalnya) tidak dibahas di sumber yang aku buka → **belum terverifikasi**. Usulan default yang aman: hanya utang yang jatuh tempo dalam 12 bulan ke depan.

---

## 4. Zakat perdagangan (tijarah)

**Dalil:**
- QS Al-Baqarah 2:267 (*min ṭayyibāti mā kasabtum*), di atas.
- **HR Abu Dawud 1562**, hadis Samurah bin Jundub: *"كَانَ يَأْمُرُنَا أَنْ نُخْرِجَ الصَّدَقَةَ مِنَ الَّذِي نُعِدُّ لِلْبَيْعِ"* ("Beliau memerintahkan kami mengeluarkan zakat dari barang yang kami siapkan untuk dijual"). **Derajat: dha'if menurut Al-Albani** ([sunnah.com/abudawud:1562](https://sunnah.com/abudawud:1562)). Konten produk harus jujur soal ini dan tidak menyajikannya sebagai hadis sahih.
- Kewajiban zakat perdagangan tetap dipegang jumhur ulama dan menjadi hukum positif di PMA 52/2014. Atsar sahabat lain yang biasa dikutip (misalnya Umar) **tidak aku verifikasi** di sesi ini.

**Ketentuan PMA 52/2014 Ps. 11–13:** nisab setara 85 g emas, kadar 2,5%, haul. Yang dizakati = **Aktiva Lancar − Kewajiban Jangka Pendek** pada saat haul. Aktiva lancar = kas, piutang lancar, dan persediaan barang dagangan; aset tetap tidak dihitung.

**Rumus:** `(kas + piutang lancar + persediaan [harga jual saat ini]) − utang jangka pendek` → jika ≥ nisab, kali 2,5%.

---

## 5. Zakat pertanian

> ۞ وَهُوَ ٱلَّذِىٓ أَنشَأَ جَنَّـٰتٍ مَّعْرُوشَـٰتٍ وَغَيْرَ مَعْرُوشَـٰتٍ وَٱلنَّخْلَ وَٱلزَّرْعَ مُخْتَلِفًا أُكُلُهُۥ وَٱلزَّيْتُونَ وَٱلرُّمَّانَ مُتَشَـٰبِهًا وَغَيْرَ مُتَشَـٰبِهٍ ۚ كُلُوا۟ مِن ثَمَرِهِۦٓ إِذَآ أَثْمَرَ وَءَاتُوا۟ حَقَّهُۥ يَوْمَ حَصَادِهِۦ ۖ وَلَا تُسْرِفُوٓا۟ ۚ إِنَّهُۥ لَا يُحِبُّ ٱلْمُسْرِفِينَ
>
> *"Dan Dialah yang menjadikan tanaman-tanaman yang merambat dan yang tidak merambat, pohon kurma, tanaman yang beraneka ragam rasanya, zaitun dan delima yang serupa (bentuk dan warnanya) dan tidak serupa (rasanya). Makanlah buahnya apabila ia berbuah dan berikanlah haknya (zakatnya) pada waktu memetik hasilnya, tapi janganlah berlebih-lebihan. Sesungguhnya Allah tidak menyukai orang-orang yang berlebih-lebihan."* (QS Al-An'am [6:141])

> يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَنفِقُوا۟ مِن طَيِّبَـٰتِ مَا كَسَبْتُمْ وَمِمَّآ أَخْرَجْنَا لَكُم مِّنَ ٱلْأَرْضِ ۖ وَلَا تَيَمَّمُوا۟ ٱلْخَبِيثَ مِنْهُ تُنفِقُونَ وَلَسْتُم بِـَٔاخِذِيهِ إِلَّآ أَن تُغْمِضُوا۟ فِيهِ ۚ وَٱعْلَمُوٓا۟ أَنَّ ٱللَّهَ غَنِىٌّ حَمِيدٌ
>
> *"Wahai orang-orang yang beriman! Infakkanlah sebagian dari hasil usahamu yang baik-baik dan sebagian dari apa yang Kami keluarkan dari bumi untukmu. Janganlah kamu memilih yang buruk untuk kamu keluarkan, padahal kamu sendiri tidak mau mengambilnya melainkan dengan memicingkan mata (enggan) terhadapnya. Dan ketahuilah bahwa Allah Mahakaya, Maha Terpuji."* (QS Al-Baqarah [2:267]) (frasa *wa mimmā akhrajnā lakum minal-arḍ*)

**HR Bukhari 1483** dari Ibnu Umar (sahih):
> فِيمَا سَقَتِ السَّمَاءُ وَالْعُيُونُ أَوْ كَانَ عَثَرِيًّا الْعُشْرُ، وَمَا سُقِيَ بِالنَّضْحِ نِصْفُ الْعُشْرِ
>
> "Tanaman yang diairi hujan, mata air, atau yang menyerap air sendiri, zakatnya sepersepuluh (10%). Yang diairi dengan alat pengangkut air, seperdua puluh (5%)." [sunnah.com/bukhari:1483](https://sunnah.com/bukhari:1483)

**Nisab: 5 wasaq** (HR Bukhari 1405, di atas). 1 wasaq = 60 sha'. Konversi ke kg berbeda-beda; PMA memakai **653 kg gabah** (≈ 524 kg beras di PMA 52/2014 Ps. 26).

**PMA 52/2014 Ps. 14–15:** nisab 653 kg gabah; kadar **10% tadah hujan** atau **5% dengan irigasi dan perawatan lainnya**; ditunaikan saat panen, tanpa haul.

**Belum terverifikasi:** kadar 7,5% untuk pengairan campuran dan apakah biaya produksi boleh dikurangkan. Keduanya populer di literatur zakat Indonesia, tetapi tidak aku temukan di sumber primer yang aku buka. Di MVP keduanya tidak dijadikan fitur; cukup ditandai "lihat penjelasan ulama".

---

## 6. Zakat fitrah

**HR Bukhari 1503** dari Ibnu Umar (sahih):
> فَرَضَ رَسُولُ اللَّهِ صلى الله عليه وسلم زَكَاةَ الْفِطْرِ صَاعًا مِنْ تَمْرٍ، أَوْ صَاعًا مِنْ شَعِيرٍ عَلَى الْعَبْدِ وَالْحُرِّ، وَالذَّكَرِ وَالأُنْثَى، وَالصَّغِيرِ وَالْكَبِيرِ مِنَ الْمُسْلِمِينَ، وَأَمَرَ بِهَا أَنْ تُؤَدَّى قَبْلَ خُرُوجِ النَّاسِ إِلَى الصَّلاَةِ
>
> "Rasulullah ﷺ mewajibkan zakat fitrah satu sha' kurma atau satu sha' gandum atas setiap muslim, hamba maupun merdeka, laki-laki maupun perempuan, kecil maupun besar, dan memerintahkan agar ditunaikan sebelum orang-orang keluar untuk salat (Id)." [sunnah.com/bukhari:1503](https://sunnah.com/bukhari:1503)

**HR Abu Dawud 1609** dari Ibnu Abbas, **hasan** (Al-Albani):
> فَرَضَ رَسُولُ اللَّهِ صلى الله عليه وسلم زَكَاةَ الْفِطْرِ طُهْرَةً لِلصَّائِمِ مِنَ اللَّغْوِ وَالرَّفَثِ وَطُعْمَةً لِلْمَسَاكِينِ مَنْ أَدَّاهَا قَبْلَ الصَّلاَةِ فَهِيَ زَكَاةٌ مَقْبُولَةٌ وَمَنْ أَدَّاهَا بَعْدَ الصَّلاَةِ فَهِيَ صَدَقَةٌ مِنَ الصَّدَقَاتِ
>
> "...sebagai penyuci bagi orang yang berpuasa dari perkataan sia-sia dan kotor, serta makanan bagi orang miskin. Siapa yang menunaikannya sebelum salat (Id), itu zakat yang diterima; siapa yang menunaikannya setelah salat, itu sedekah biasa." [sunnah.com/abudawud:1609](https://sunnah.com/abudawud:1609)

**HR Bukhari 1506 & 1510** (Abu Sa'id): para sahabat membayar satu sha' dari **makanan pokok** mereka (gandum, kurma, kismis, keju). Inilah dasar memakai **beras** di Indonesia.

**Catatan QS Al-A'la 87:14** (*qad aflaḥa man tazakkā*): ayat ini sering dikaitkan dengan zakat fitrah, tetapi terjemahan Kemenag memaknainya "menyucikan diri (dengan beriman)". Kaitan langsungnya dengan zakat fitrah adalah tafsir sebagian ulama yang **belum aku verifikasi** sanadnya, jadi ayat ini **tidak** dipakai sebagai dalil utama di produk.

**Ketentuan Indonesia:**
- PMA 52/2014 Ps. 30–31: **2,5 kg atau 3,5 liter beras/makanan pokok per jiwa**, kualitas sesuai yang dikonsumsi sehari-hari, **dapat diganti uang** senilai itu, dan ditunaikan sejak awal Ramadan sampai sebelum salat Idulfitri.
- **BAZNAS RI 2026** (SK Ketua BAZNAS No. 14/2026): **Rp50.000/jiwa** (setara 2,5 kg / 3,5 L beras premium); fidyah Rp65.000/jiwa/hari. BAZNAS daerah dan LAZ boleh menetapkan nilai sendiri. ([baznas.go.id](https://baznas.go.id/news-show/Ramadan_2026,_BAZNAS_RI_Tetapkan_Zakat_Fitrah_Rp50_Ribu/3708/))

**Khilaf fitrah dengan uang** ([NU Online](https://islam.nu.or.id/nasional/begini-rincian-hukum-zakat-fitrah-dengan-uang-q2Y38)): Syafi'iyah dan jumhur tidak membolehkan; Hanafiyah (dan Ibnu Qasim dari Malikiyah) membolehkan. LBM PBNU (18 Mei 2020) membolehkan uang dengan cara *intiqal madzhab*, tetapi kadarnya mengikuti ukuran Syafi'iyah, yaitu 2,75 kg, 2,5 kg, atau 3,5 liter beras. → **UI menampilkan dua hasil: kg beras dan rupiah**, dengan pilihan kadar 2,5 kg (PMA/BAZNAS) atau 2,75 kg (ihtiyath NU).

---

## 7. Catatan singkat (bukan fitur utama MVP)

- **Rikaz / harta temuan:** 20% tanpa nisab dan haul. HR Bukhari 1499: *"وَفِي الرِّكَازِ الْخُمُسُ"*. PMA 52/2014 Ps. 28.
- **Peternakan:** HR Bukhari 1454 (surat Abu Bakar kepada Anas) memuat tabel unta dan kambing; HR Abu Dawud 1572 (sahih) memuat sapi (30 ekor → tabi', 40 ekor → musinnah). PMA 52/2014 Ps. 16–18 + Lampiran. Ternak yang dikandangkan untuk dijual masuk zakat perdagangan. Tabelnya rumit dan penggunanya sedikit → di fase 2 cukup halaman informasi, bukan kalkulator.
- **Perikanan, pertambangan, perindustrian** (PMA Ps. 19–25): nisab 85 g emas, 2,5%. Tidak masuk MVP.

---

## 8. Daftar verifikasi

**Terverifikasi dari sumber primer (dibuka langsung):**
- Ayat 2:43, 2:219, 2:267, 6:141, 9:34, 9:35, 9:60, 9:103, 51:19 (quran.com API, terjemahan Kemenag).
- HR Bukhari 1395, 1405, 1447, 1454, 1483, 1499, 1503, 1506, 1510; Muslim 979, 987; Abu Dawud 1562 (dha'if), 1572, 1573, 1609; Tirmidzi 631–632; Ibnu Majah 1792 (sunnah.com, termasuk derajat).
- SK BAZNAS 15/2026 (PDF), Kajian Nisab BAZNAS 2026 (PDF), PMA 52/2014 (PDF), Himpunan Fatwa Zakat MUI 1976–2021 (PDF), berita BAZNAS soal fitrah 2026, artikel NU Online dan Muhammadiyah.

**Belum terverifikasi atau sengaja tidak dipakai:**
- Teks PMA 31/2019 dari dokumen aslinya; isinya hanya dikutip melalui SK dan kajian BAZNAS.
- Kadar 7,5% untuk pengairan campuran, pengurangan biaya produksi pertanian, dan rincian jenis utang yang boleh dikurangi.
- Kaitan QS 87:14 dengan zakat fitrah, dan atsar sahabat tentang zakat perdagangan.
- Harga emas tanggal 14 Nov 2026; yang dipakai harga 13 Nov karena Logam Mulia memblokir akses dari server.
