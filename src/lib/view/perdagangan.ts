/** Tampilan hasil zakat perdagangan: aset lancar − utang jangka pendek (PMA 52/2014 Ps. 12). */
import { NISAB_EMAS_G, perdagangan, rupiah, type Acuan, type Hasil } from '../zakat';
import { kepala, meter, pct, PESAN_UMUM, tabel, type HasilView, type Ringkas } from './umum';

export interface StatePerdagangan { kas: number; piutang: number; persediaan: number; utang: number; haul: boolean }
export const AWAL_PERDAGANGAN: StatePerdagangan = { kas: 0, piutang: 0, persediaan: 0, utang: 0, haul: true };

function ringkas(r: Hasil): Ringkas {
  const per = 'per tahun (saat haul)';
  if (r.alasan === 'kosong') return { status: 'Menunggu isian', kelas: '', angka: rupiah(0), per, kosong: true };
  if (r.wajib) return { status: 'Wajib zakat', kelas: 'yes', angka: rupiah(r.zakat), per, kosong: false };
  if (r.alasan === 'belum-haul') return { status: 'Belum haul', kelas: 'wait', angka: rupiah(0), per, kosong: false };
  return { status: 'Belum wajib', kelas: '', angka: rupiah(0), per, kosong: false };
}

export function renderHasil(s: StatePerdagangan, a: Acuan): HasilView & { r: Hasil } {
  const r = perdagangan(s, a);
  const ring = ringkas(r);
  const pesan = r.wajib ? undefined
    : r.alasan === 'kosong' ? 'Isi kas, piutang, dan stok usahamu saat haul.'
    : r.alasan === 'belum-haul' ? PESAN_UMUM.belumHaul : PESAN_UMUM.bawahNisab;
  let html = kepala(ring, { wajib: r.wajib, pesan, tambahan: ring.kosong ? '' : meter(r.dasar, r.nisab, { label: 'Aset bersih' }) });
  if (!ring.kosong) {
    html += tabel(r.rincian, {
      nisab: [`Nisab (${NISAB_EMAS_G} g emas)`, rupiah(r.nisab)],
      rumus: r.wajib ? `${pct(r.kadar)} × ${rupiah(r.dasar)} = ${rupiah(r.zakat)}` : undefined,
    });
  }
  return { html, r, ring };
}

export function teksSalin(s: StatePerdagangan, a: Acuan): string {
  const r = perdagangan(s, a);
  return [
    'TakarZakat · Zakat perdagangan',
    ...r.rincian.map(([l, v]) => `${l}: ${typeof v === 'number' ? rupiah(v) : v}`),
    `Nisab (${NISAB_EMAS_G} g emas): ${rupiah(r.nisab)}`,
    `Haul 1 tahun: ${s.haul ? 'sudah' : 'belum'}`,
    `Zakat: ${r.wajib ? rupiah(r.zakat) : 'belum wajib'}`,
    'takarzakat.pages.dev',
  ].join('\n');
}
