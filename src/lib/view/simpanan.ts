/** Tampilan hasil zakat simpanan & emas (uang, emas, perak, investasi, piutang, perhiasan). */
import { NISAB_EMAS_G, NISAB_PERAK_G, rupiah, simpanan, type Acuan, type Hasil } from '../zakat';
import { kepala, meter, pct, pilihan, PESAN_UMUM, tabel, type HasilView, type Ringkas } from './umum';

export const JENIS_HARTA = ['uang', 'emas', 'perak', 'investasi', 'piutang', 'perhiasan'] as const;
export type JenisHarta = (typeof JENIS_HARTA)[number];

export interface StateSimpanan {
  punya: JenisHarta[];
  uang: number; emasGram: number; perakGram: number; investasi: number; piutang: number;
  perhiasanGram: number; karatPerhiasan: number; sertakanPerhiasan: boolean;
  utang: number; haul: boolean; basis: 'emas' | 'perak';
}

export const AWAL_SIMPANAN: StateSimpanan = {
  punya: ['uang', 'emas'], uang: 0, emasGram: 0, perakGram: 0, investasi: 0, piutang: 0,
  perhiasanGram: 0, karatPerhiasan: 18, sertakanPerhiasan: false, utang: 0, haul: true, basis: 'emas',
};

/** Harta yang tidak dicentang tidak ikut dihitung walau isiannya masih ada. */
export function hitung(s: StateSimpanan, a: Acuan, basis = s.basis): Hasil {
  const ada = (j: JenisHarta) => s.punya.includes(j);
  return simpanan({
    uang: ada('uang') ? s.uang : 0,
    emasGram: ada('emas') ? s.emasGram : 0,
    perakGram: ada('perak') ? s.perakGram : 0,
    investasi: ada('investasi') ? s.investasi : 0,
    piutang: ada('piutang') ? s.piutang : 0,
    perhiasanGram: ada('perhiasan') ? s.perhiasanGram : 0,
    karatPerhiasan: s.karatPerhiasan,
    sertakanPerhiasan: s.sertakanPerhiasan,
    utang: s.utang, haul: s.haul, basis,
  }, a);
}

function ringkas(r: Hasil): Ringkas {
  const per = 'per tahun (saat haul)';
  if (r.alasan === 'kosong') return { status: 'Menunggu isian', kelas: '', angka: rupiah(0), per, kosong: true };
  if (r.wajib) return { status: 'Wajib zakat', kelas: 'yes', angka: rupiah(r.zakat), per, kosong: false };
  if (r.alasan === 'belum-haul') return { status: 'Belum haul', kelas: 'wait', angka: rupiah(0), per, kosong: false };
  return { status: 'Belum wajib', kelas: '', angka: rupiah(0), per, kosong: false };
}

export function renderHasil(s: StateSimpanan, a: Acuan): HasilView & { r: Hasil } {
  const r = hitung(s, a);
  const ring = ringkas(r);
  const pesan = r.wajib ? undefined
    : r.alasan === 'kosong' ? 'Centang harta yang kamu punya, lalu isi nilainya.'
    : r.alasan === 'belum-haul' ? PESAN_UMUM.belumHaul : PESAN_UMUM.bawahNisab;
  let html = kepala(ring, { wajib: r.wajib, pesan, tambahan: ring.kosong ? '' : meter(r.dasar, r.nisab, { label: 'Harta bersih' }) });
  if (!ring.kosong) {
    const e = hitung(s, a, 'emas');
    const p = hitung(s, a, 'perak');
    const status = (x: Hasil) => (x.wajib ? rupiah(x.zakat) : x.alasan === 'belum-haul' ? 'Belum haul' : 'Belum wajib');
    html += tabel(r.rincian, {
      nisab: [s.basis === 'perak' ? `Nisab (${NISAB_PERAK_G} g perak)` : `Nisab (${NISAB_EMAS_G} g emas)`, rupiah(r.nisab)],
      rumus: r.wajib ? `${pct(r.kadar)} × ${rupiah(r.dasar)} = ${rupiah(r.zakat)}` : undefined,
    }) + pilihan({
      judul: 'Patokan nisab: emas atau perak?',
      teks: 'Hadis menetapkan dua nisab: 20 dinar emas dan 200 dirham perak. PMA 52/2014 dan lembaga di Indonesia memakai <b>emas 85 g</b>. Sebagian ulama menganjurkan <b>perak 595 g</b> yang jauh lebih rendah karena lebih berpihak pada penerima zakat.',
      kunci: 'basis', aktif: s.basis,
      kartu: [
        { v: 'emas', t: `Emas ${NISAB_EMAS_G} g`, nilai: status(e), sub: `Nisab ${rupiah(e.nisab)}` },
        { v: 'perak', t: `Perak ${NISAB_PERAK_G} g`, nilai: status(p), sub: `Nisab ${rupiah(p.nisab)}` },
      ],
    });
  }
  return { html, r, ring };
}

export function teksSalin(s: StateSimpanan, a: Acuan): string {
  const r = hitung(s, a);
  return [
    'TakarZakat · Zakat simpanan & emas',
    ...r.rincian.map(([l, v]) => `${l}: ${typeof v === 'number' ? rupiah(v) : v}`),
    `Nisab (${s.basis === 'perak' ? `${NISAB_PERAK_G} g perak` : `${NISAB_EMAS_G} g emas`}): ${rupiah(r.nisab)}`,
    `Haul 1 tahun: ${s.haul ? 'sudah' : 'belum'}`,
    `Zakat: ${r.wajib ? rupiah(r.zakat) : 'belum wajib'}`,
    `Harga emas: ${rupiah(a.emas24)}/g · perak: ${rupiah(a.perak)}/g`,
    'takarzakat.pages.dev',
  ].join('\n');
}
