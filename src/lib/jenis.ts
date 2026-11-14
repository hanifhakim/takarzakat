/** Daftar jenis zakat: satu sumber untuk beranda, routing, dan SEO. */
export interface Jenis {
  id: 'penghasilan' | 'simpanan' | 'perdagangan' | 'pertanian' | 'fitrah';
  slug: string;
  nama: string;
  ringkas: string;
  waktu: string;
  judul: string;
  intro: string;
}

export const JENIS: Jenis[] = [
  { id: 'penghasilan', slug: 'zakat-penghasilan', nama: 'Penghasilan', ringkas: 'Gaji, honor, upah, jasa profesi', waktu: 'Tiap terima',
    judul: 'Zakat penghasilan', intro: 'Untuk gaji, honor, dan penghasilan profesi. Kadar 2,5% bila mencapai nisab.' },
  { id: 'simpanan', slug: 'zakat-simpanan-emas', nama: 'Simpanan & emas', ringkas: 'Tabungan, emas, perak, investasi', waktu: 'Tiap tahun',
    judul: 'Zakat simpanan & emas', intro: 'Uang, emas, perak, dan investasi digabung terhadap satu nisab, lalu 2,5% setelah satu tahun.' },
  { id: 'perdagangan', slug: 'zakat-perdagangan', nama: 'Perdagangan', ringkas: 'Kas usaha, piutang, stok barang', waktu: 'Tiap tahun',
    judul: 'Zakat perdagangan', intro: 'Aset lancar usaha dikurangi utang jangka pendek, 2,5% setelah satu tahun.' },
  { id: 'pertanian', slug: 'zakat-pertanian', nama: 'Pertanian', ringkas: 'Hasil panen padi dan tanaman lain', waktu: 'Saat panen',
    judul: 'Zakat pertanian', intro: 'Dikeluarkan saat panen, tanpa menunggu setahun. 10% atau 5% tergantung pengairan.' },
  { id: 'fitrah', slug: 'zakat-fitrah', nama: 'Fitrah', ringkas: 'Per jiwa, di bulan Ramadan', waktu: 'Ramadan',
    judul: 'Zakat fitrah', intro: 'Wajib bagi setiap muslim yang punya kelebihan makanan pada malam dan hari Idulfitri.' },
];
