/** Konfigurasi situs yang bukan angka zakat. */
export const SITUS = {
  nama: 'TakarZakat',
  url: 'https://takarzakat.pages.dev',
  /** Ditampilkan tersamar dan dirakit di browser supaya tidak mudah dipanen bot spam. */
  email: { user: 'hanif.hkim', domain: 'gmail.com' },
  repo: 'https://github.com/hanifhakim/takarzakat',
  /**
   * Token Cloudflare Web Analytics (publik, memang terlihat di HTML). Kosong = analitik mati.
   * Hanya menghitung kunjungan halaman; tanpa cookie, tanpa angka isian pengguna.
   */
  analytics: '',
  /** Status review syariah; ubah saat sudah ada pengulas. */
  review: null as null | { oleh: string; tanggal: string },
} as const;
