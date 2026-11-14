/** Tampilan hasil zakat fitrah: jiwa × 2,5 kg (atau 2,75 kg); beras, nominal BAZNAS, atau harga beras lokal. */
import { fitrah, rupiah, type Acuan, type HasilFitrah } from '../zakat';
import { angka, kepala, tabel, type HasilView, type Ringkas } from './umum';

export interface StateFitrah { jiwa: number; kadarKg: number; bayar: 'beras' | 'baznas' | 'harga'; hargaBeras: number }
export const AWAL_FITRAH: StateFitrah = { jiwa: 1, kadarKg: 2.5, bayar: 'baznas', hargaBeras: 0 };

const kg = (x: number) => `${angka(x, 2)} kg`;

export function hitung(s: StateFitrah, a: Acuan): HasilFitrah {
  return fitrah({ jiwa: s.jiwa, kadarKg: s.kadarKg, modeUang: s.bayar === 'harga' ? 'harga' : 'baznas', hargaBeras: s.hargaBeras }, a);
}

export function renderHasil(s: StateFitrah, a: Acuan): HasilView & { r: HasilFitrah } {
  const r = hitung(s, a);
  const per = `${r.jiwa} jiwa`;
  const hargaKg = s.hargaBeras || a.berasKg;
  const rpBeras = r.zakatKg * hargaKg;
  const ring: Ringkas = r.jiwa === 0
    ? { status: 'Menunggu isian', kelas: '', angka: rupiah(0), per, kosong: true }
    : { status: 'Zakat fitrah', kelas: 'yes', angka: s.bayar === 'beras' ? `${kg(r.zakatKg)} beras` : rupiah(r.zakat), per, kosong: false };
  const setara = s.bayar === 'beras' ? `±${rupiah(rpBeras)}` : `${kg(r.zakatKg)} beras`;
  let html = kepala(ring, {
    wajib: r.wajib, setara: ring.kosong ? undefined : setara,
    pesan: 'Tunaikan sejak awal Ramadan, paling lambat sebelum salat Idulfitri.',
  });
  if (!ring.kosong) {
    html += tabel([
      [`${r.jiwa} jiwa × ${angka(r.kadarKg)} kg`, kg(r.zakatKg)],
      [`Uang, nominal BAZNAS ${rupiah(a.fitrahBaznas)}/jiwa`, rupiah(r.jiwa * a.fitrahBaznas)],
      [`Uang, harga beras ${rupiah(hargaKg)}/kg`, rupiah(Math.round(rpBeras))],
    ], { tebalAkhir: false });
    if (r.kadarKg === 2.75 && s.bayar === 'baznas') {
      html += `<p class="r-note">Nominal BAZNAS dihitung dari 2,5 kg per jiwa. Untuk takaran 2,75 kg, pilih "Uang · Harga lokal".</p>`;
    }
  }
  return { html, r, ring };
}

export function teksSalin(s: StateFitrah, a: Acuan): string {
  const r = hitung(s, a);
  const bayar = s.bayar === 'beras' ? `${kg(r.zakatKg)} beras` : rupiah(r.zakat);
  return [
    'TakarZakat · Zakat fitrah',
    `${r.jiwa} jiwa × ${angka(r.kadarKg)} kg = ${kg(r.zakatKg)} beras`,
    `Dibayar: ${bayar}${s.bayar === 'harga' ? ` (harga beras ${rupiah(s.hargaBeras || a.berasKg)}/kg)` : s.bayar === 'baznas' ? ` (BAZNAS ${rupiah(a.fitrahBaznas)}/jiwa)` : ''}`,
    'Batas: sebelum salat Idulfitri',
    'takarzakat.pages.dev',
  ].join('\n');
}
