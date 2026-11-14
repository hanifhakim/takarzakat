/**
 * FAQ per jenis zakat: tampil di halaman dan dipakai untuk JSON-LD FAQPage.
 * Jawaban teks biasa (tanpa HTML) supaya aman untuk keduanya. Angka diambil dari acuan.json saat build.
 */
import type { Jenis } from '../lib/jenis';
import { ACUAN, NISAB_EMAS_G, NISAB_GABAH_KG, NISAB_PERAK_G, rupiah } from '../lib/zakat';

export interface Tanya { q: string; a: string }

const tgl = new Date(ACUAN.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const nisabEmas = rupiah(Math.round(NISAB_EMAS_G * ACUAN.emas24));
const bulan = rupiah(ACUAN.nisabPenghasilanBulanBaznas);

export const FAQ: Record<Jenis['id'], Tanya[]> = {
  penghasilan: [
    { q: 'Berapa nisab zakat penghasilan 2026?',
      a: `Menurut SK Ketua BAZNAS No. 15 Tahun 2026, nisabnya ${bulan} per bulan atau ${rupiah(ACUAN.nisabPenghasilanTahunBaznas)} per tahun, setara 85 gram emas 14 karat. Metode penghasilan bersih memakai 85 gram emas 24 karat, sekitar ${nisabEmas} per tahun pada ${tgl}.` },
    { q: 'Gaji 8 juta per bulan wajib zakat?',
      a: `Dengan metode BAZNAS, ya: Rp8.000.000 melewati nisab ${bulan}, jadi zakatnya 2,5% × Rp8.000.000 = Rp200.000 per bulan. Dengan metode penghasilan bersih, tergantung sisa setelah kebutuhan pokok dan cicilan.` },
    { q: 'Zakat penghasilan dihitung dari gaji kotor atau bersih?',
      a: 'Keduanya pendapat yang diakui. BAZNAS menghitung dari penghasilan kotor (bruto). Ijtima\u2019 Ulama MUI 2018 dan Muhammadiyah menghitung dari penghasilan setelah kebutuhan pokok dan utang jatuh tempo.' },
    { q: 'Apakah zakat penghasilan wajib menurut semua ulama?',
      a: 'Tidak. MUI (Fatwa 3/2003), BAZNAS, dan Muhammadiyah mewajibkannya. Jumhur ulama empat mazhab, yang banyak dirujuk NU, berpendapat gaji tidak dizakati saat diterima; bagian yang tersimpan dizakati sebagai simpanan setelah mencapai nisab dan satu tahun.' },
  ],
  simpanan: [
    { q: 'Berapa nisab zakat emas 2026?',
      a: `${NISAB_EMAS_G} gram emas. Dengan harga emas dunia pada ${tgl} (${rupiah(ACUAN.emas24)}/gram), nisabnya sekitar ${nisabEmas}. Kalkulator memakai harga terkini saat dibuka.` },
    { q: 'Apakah tabungan wajib dizakati?',
      a: 'Ya, bila jumlah tabungan, emas, dan harta simpanan lain setelah dikurangi utang jatuh tempo mencapai nisab dan sudah dimiliki satu tahun hijriah. Zakatnya 2,5%.' },
    { q: 'Apakah perhiasan yang dipakai wajib dizakati?',
      a: 'Ada perbedaan pendapat. Mazhab Syafi\u2019i, Maliki, dan Hanbali: perhiasan yang dipakai secara wajar tidak dizakati. Mazhab Hanafi: tetap dizakati. Perhiasan yang disimpan atau berlebihan dihitung seperti emas simpanan.' },
    { q: 'Kenapa ada nisab emas dan nisab perak?',
      a: `Hadis menetapkan 20 dinar emas dan 200 dirham perak, setara ${NISAB_EMAS_G} g emas dan ${NISAB_PERAK_G} g perak. Peraturan di Indonesia memakai emas. Nisab perak nilainya jauh lebih rendah, jadi dengan patokan perak lebih banyak harta yang terhitung wajib zakat.` },
  ],
  perdagangan: [
    { q: 'Bagaimana cara menghitung zakat perdagangan?',
      a: 'Saat genap satu tahun, jumlahkan kas, piutang lancar, dan stok barang (harga pasar), lalu kurangi utang jangka pendek. Bila hasilnya mencapai nisab 85 gram emas, zakatnya 2,5%.' },
    { q: 'Apakah aset tetap seperti toko dan kendaraan ikut dizakati?',
      a: 'Tidak. Bangunan, mesin, peralatan, dan kendaraan operasional tidak dihitung. Yang dihitung hanya aset lancar yang berputar (PMA 52/2014 Pasal 12).' },
    { q: 'Stok barang dinilai dengan harga beli atau harga jual?',
      a: 'Dengan harga pasar saat haul, yaitu harga jika barang itu dijual saat itu, bukan harga beli lamanya.' },
  ],
  pertanian: [
    { q: 'Berapa nisab zakat pertanian?',
      a: `5 wasaq, yang di Indonesia ditetapkan setara ${NISAB_GABAH_KG} kg gabah. Untuk tanaman lain, nilai panen dibandingkan dengan nilai ${NISAB_GABAH_KG} kg gabah.` },
    { q: 'Zakat pertanian 5% atau 10%?',
      a: '10% bila tanaman diairi hujan, sungai, atau mata air tanpa biaya. 5% bila memakai irigasi berbiaya seperti pompa atau membeli air (HR Bukhari 1483).' },
    { q: 'Apakah zakat pertanian menunggu satu tahun?',
      a: 'Tidak. Zakat pertanian dikeluarkan setiap kali panen.' },
  ],
  fitrah: [
    { q: 'Berapa zakat fitrah 2026?',
      a: `2,5 kg beras per jiwa, atau ${rupiah(ACUAN.fitrahBaznas)} per jiwa bila dibayar dengan uang (SK Ketua BAZNAS No. 14 Tahun 2026). Daerah bisa menetapkan nominal berbeda sesuai harga beras setempat.` },
    { q: 'Bolehkah zakat fitrah dibayar dengan uang?',
      a: 'Ada perbedaan pendapat. Mazhab Hanafi membolehkan; mayoritas ulama, termasuk mazhab Syafi\u2019i, berpendapat harus dengan makanan pokok. PMA 52/2014 dan BAZNAS membolehkan uang senilai beras, dan LBM PBNU (2020) membolehkannya dengan takaran mazhab Syafi\u2019i (2,5–2,75 kg). Kalkulator menampilkan hasil dalam kg beras dan rupiah.' },
    { q: 'Siapa saja yang wajib dibayarkan zakat fitrahnya?',
      a: 'Setiap muslim, anak kecil maupun dewasa (HR Bukhari 1503). Kepala keluarga membayarkan untuk dirinya dan orang-orang yang nafkahnya ia tanggung.' },
    { q: 'Kapan batas waktu membayar zakat fitrah?',
      a: 'Boleh sejak awal Ramadan, paling lambat sebelum salat Idulfitri. Setelah salat Id, pembayaran terhitung sedekah biasa.' },
  ],
};
