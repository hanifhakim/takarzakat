/**
 * Tampilan hasil zakat penghasilan sebagai string HTML (murni → bisa diuji).
 * Teks dari pengguna tidak pernah masuk ke HTML; label berasal dari zakat.ts dan tetap di-escape.
 */
import { penghasilan, rupiah, type Acuan, type Hasil, type InputPenghasilan } from '../zakat';
import { kepala, meter, pct, pilihan, tabel, type HasilView, type Ringkas } from './umum';

export { esc } from './umum';

export interface StatePenghasilan extends Required<Pick<InputPenghasilan, 'metode' | 'periode'>> {
  gaji: number; lain: number; pokok: number; utang: number;
}

export const AWAL_PENGHASILAN: StatePenghasilan = { metode: 'baznas', periode: 'bulan', gaji: 0, lain: 0, pokok: 0, utang: 0 };

export function ringkas(r: Hasil, s: StatePenghasilan): Ringkas {
  const per = s.periode === 'bulan' ? 'per bulan' : 'per tahun';
  if (r.alasan === 'kosong') return { status: 'Menunggu isian', kelas: '', angka: rupiah(0), per, kosong: true };
  return r.wajib
    ? { status: 'Wajib zakat', kelas: 'yes', angka: rupiah(r.zakat), per, kosong: false }
    : { status: 'Belum wajib', kelas: '', angka: rupiah(0), per, kosong: false };
}

export function bandingkan(s: StatePenghasilan, a: Acuan): string {
  const b = penghasilan({ ...s, metode: 'baznas' }, a);
  const n = penghasilan({ ...s, metode: 'netto' }, a);
  const sepakat = b.wajib === n.wajib;
  return pilihan({
    judul: 'Kenapa hasil bisa berbeda?',
    teks: (sepakat ? 'Dengan angkamu, kedua metode sepakat soal wajib atau tidaknya; nominalnya bisa berbeda.' : 'Dengan angkamu, dua metode memberi jawaban berbeda.')
      + ' BAZNAS memakai harga <b>emas 14 karat</b> dan penghasilan <b>kotor</b>. MUI (Ijtima\u2019 Ulama 2018) dan Muhammadiyah menghitung dari penghasilan <b>bersih</b>; Muhammadiyah memakai <b>emas 24 karat</b>. Keduanya pendapat yang diakui; ikuti yang kamu yakini atau ketentuan lembaga tempatmu berzakat.',
    kunci: 'metode', aktif: s.metode,
    kartu: [
      { v: 'baznas', t: 'BAZNAS · bruto', nilai: b.wajib ? rupiah(b.zakat) : 'Belum wajib', sub: `Nisab ${rupiah(b.nisab)}` },
      { v: 'netto', t: 'Bersih · emas 24K', nilai: n.wajib ? rupiah(n.zakat) : 'Belum wajib', sub: `Nisab ${rupiah(n.nisab)}` },
    ],
    tautan: '<a class="jumhur" href="/zakat-simpanan-emas">Menurut jumhur ulama empat mazhab, gaji tidak dizakati saat diterima. Sisa yang tersimpan dihitung sebagai simpanan setelah setahun →</a>',
  });
}

export function renderHasil(s: StatePenghasilan, a: Acuan): HasilView & { r: Hasil } {
  const r = penghasilan(s, a);
  const ring = ringkas(r, s);
  const pesan = r.wajib ? undefined : r.alasan === 'kosong'
    ? 'Isi penghasilanmu. Hasil langsung muncul di sini.'
    : 'Penghasilanmu belum mencapai nisab, jadi belum wajib zakat penghasilan. Kamu tetap bisa bersedekah atau berinfak.';
  let html = kepala(ring, { wajib: r.wajib, pesan, tambahan: ring.kosong ? '' : meter(r.dasar, r.nisab) });
  if (!ring.kosong) {
    html += tabel(r.rincian, {
      nisab: [`Nisab ${s.metode === 'netto' ? '(85 g emas 24K)' : '(SK BAZNAS 15/2026)'}`, rupiah(r.nisab)],
      rumus: r.wajib ? `${pct(r.kadar)} × ${rupiah(r.dasar)} = ${rupiah(r.zakat)}` : undefined,
    }) + bandingkan(s, a);
  }
  return { html, r, ring };
}

/** Teks untuk tombol "Salin rincian". */
export function teksSalin(s: StatePenghasilan, a: Acuan): string {
  const r = penghasilan(s, a);
  const metode = s.metode === 'netto' ? 'penghasilan bersih, nisab 85 g emas 24K' : 'BAZNAS (bruto, SK 15/2026)';
  return [
    `TakarZakat · Zakat penghasilan (${s.periode === 'bulan' ? 'per bulan' : 'per tahun'})`,
    `Metode: ${metode}`,
    ...r.rincian.map(([l, v]) => `${l}: ${typeof v === 'number' ? rupiah(v) : v}`),
    `Nisab: ${rupiah(r.nisab)}`,
    `Zakat: ${r.wajib ? rupiah(r.zakat) : 'belum wajib'}`,
    `Harga emas: ${a.emas24 ? rupiah(a.emas24) + '/g' : '-'}`,
    'takarzakat.pages.dev',
  ].join('\n');
}
