/** Tampilan hasil zakat pertanian: nisab 653 kg gabah; 10% tadah hujan / 5% irigasi berbiaya. */
import { NISAB_GABAH_KG, pertanian, rupiah, type Acuan, type Hasil } from '../zakat';
import { angka, kepala, meter, pct, PESAN_UMUM, tabel, type HasilView, type Ringkas } from './umum';

export interface StatePertanian { komoditas: 'padi' | 'lain'; panenKg: number; hargaKg: number; pengairan: 'hujan' | 'irigasi' }
export const AWAL_PERTANIAN: StatePertanian = { komoditas: 'padi', panenKg: 0, hargaKg: 0, pengairan: 'hujan' };

const kg = (x: number) => `${angka(x, 1)} kg`;

function ringkas(r: Hasil, s: StatePertanian): Ringkas {
  const per = 'per panen';
  if (r.alasan === 'kosong') return { status: 'Menunggu isian', kelas: '', angka: s.komoditas === 'padi' ? '0 kg' : rupiah(0), per, kosong: true };
  if (!r.wajib) return { status: 'Belum wajib', kelas: '', angka: s.komoditas === 'padi' ? '0 kg' : rupiah(0), per, kosong: false };
  return { status: 'Wajib zakat', kelas: 'yes', angka: s.komoditas === 'padi' ? kg(r.zakatKg ?? 0) : rupiah(r.zakat), per, kosong: false };
}

export function renderHasil(s: StatePertanian, a: Acuan): HasilView & { r: Hasil } {
  const r = pertanian(s, a);
  const ring = ringkas(r, s);
  const padi = s.komoditas === 'padi';
  const tanpaHarga = !padi && s.panenKg > 0 && !s.hargaKg;
  const pesan = r.wajib ? undefined
    : r.alasan === 'kosong' ? 'Isi berat hasil panenmu.'
    : tanpaHarga ? 'Isi harga per kg supaya nilai panen bisa dibandingkan dengan nisab (setara 653 kg gabah).'
    : PESAN_UMUM.bawahNisab;
  const setara = r.wajib ? (padi ? (r.zakat ? rupiah(r.zakat) : undefined) : kg(r.zakatKg ?? 0)) : undefined;
  const m = ring.kosong || tanpaHarga ? ''
    : padi ? meter(s.panenKg, NISAB_GABAH_KG, { fmt: kg, label: 'Panen' })
    : meter(r.dasar, r.nisab, { label: 'Nilai panen' });
  let html = kepala(ring, { wajib: r.wajib, pesan, setara, tambahan: m });
  if (!ring.kosong && !tanpaHarga) {
    const rumus = !r.wajib ? undefined
      : padi ? `${pct(r.kadar)} × ${kg(s.panenKg)} = ${kg(r.zakatKg ?? 0)}`
      : `${pct(r.kadar)} × ${rupiah(r.dasar)} = ${rupiah(r.zakat)}`;
    html += tabel(
      [...r.rincian, ['Kadar', `${pct(r.kadar)} (${s.pengairan === 'irigasi' ? 'irigasi berbiaya' : 'tadah hujan'})`]],
      {
        tebalAkhir: false,
        nisab: padi ? [`Nisab (5 wasaq)`, kg(NISAB_GABAH_KG)] : [`Nisab (setara ${NISAB_GABAH_KG} kg gabah)`, rupiah(r.nisab)],
        rumus,
      },
    );
  }
  return { html, r, ring };
}

export function teksSalin(s: StatePertanian, a: Acuan): string {
  const r = pertanian(s, a);
  const padi = s.komoditas === 'padi';
  return [
    `TakarZakat · Zakat pertanian (${padi ? 'padi' : 'tanaman lain'}, ${s.pengairan === 'irigasi' ? 'irigasi 5%' : 'tadah hujan 10%'})`,
    ...r.rincian.map(([l, v]) => `${l}: ${typeof v === 'number' ? rupiah(v) : v}`),
    `Nisab: ${padi ? kg(NISAB_GABAH_KG) : rupiah(r.nisab)}`,
    `Zakat: ${r.wajib ? (padi ? `${kg(r.zakatKg ?? 0)} (±${rupiah(r.zakat)})` : rupiah(r.zakat)) : 'belum wajib'}`,
    'takarzakat.pages.dev',
  ].join('\n');
}
