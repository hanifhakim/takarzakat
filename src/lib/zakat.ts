/**
 * Inti perhitungan zakat TakarZakat. Murni (tanpa DOM), dipakai di browser dan diuji Vitest.
 * Dasar hukum tiap rumus: lihat docs/landasan-hukum.md.
 */
import acuanJson from '../data/acuan.json';

export interface Acuan {
  tanggal: string;
  emas24: number;
  perak: number;
  gabahKg: number;
  berasKg: number;
  fitrahBaznas: number;
  nisabPenghasilanTahunBaznas: number;
  nisabPenghasilanBulanBaznas: number;
}

/** Angka acuan bawaan dari src/data/acuan.json. Pengguna boleh menimpanya. */
export const ACUAN: Acuan = {
  tanggal: acuanJson.diperbarui,
  emas24: acuanJson.emas24.nilai,
  perak: acuanJson.perak.nilai,
  gabahKg: acuanJson.gabahKg.nilai,
  berasKg: acuanJson.berasKg.nilai,
  fitrahBaznas: acuanJson.fitrahBaznas.nilai,
  nisabPenghasilanTahunBaznas: acuanJson.nisabPenghasilanBaznas.tahun,
  nisabPenghasilanBulanBaznas: acuanJson.nisabPenghasilanBaznas.bulan,
};

export const KADAR = 0.025;
export const NISAB_EMAS_G = 85; // 20 dinar (PMA 52/2014 Ps. 4)
export const NISAB_PERAK_G = 595; // 200 dirham (PMA 52/2014 Ps. 5)
export const NISAB_GABAH_KG = 653; // 5 wasaq (PMA 52/2014 Ps. 14)

export type Alasan = 'kosong' | 'di-bawah-nisab' | 'belum-haul' | null;
export type Rincian = [label: string, nilai: number | string];

export interface Hasil {
  jenis: 'penghasilan' | 'simpanan' | 'perdagangan' | 'pertanian';
  wajib: boolean;
  alasan: Alasan;
  dasar: number;
  nisab: number;
  kadar: number;
  zakat: number;
  zakatKg?: number;
  nisabKg?: number;
  rincian: Rincian[];
}

export interface HasilFitrah {
  jenis: 'fitrah';
  wajib: boolean;
  alasan: Alasan;
  jiwa: number;
  kadarKg: number;
  zakatKg: number;
  zakat: number;
}

/** Angka aman: non-angka, negatif, NaN, Infinity → 0. */
export function n(x: unknown): number {
  const v = Number(x);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function hasil(o: Omit<Hasil, 'zakat'> & { zakatKg?: number }): Hasil {
  return {
    ...o,
    dasar: Math.round(o.dasar),
    nisab: Math.round(o.nisab),
    zakat: o.wajib ? Math.round(o.dasar * o.kadar) : 0,
  };
}

/* ---------- Penghasilan ---------- */
export interface InputPenghasilan {
  /** 'baznas' = bruto, nisab SK BAZNAS (emas 14K). 'netto' = bersih (MUI 2018 / Muhammadiyah), nisab 85 g emas 24K. */
  metode?: 'baznas' | 'netto';
  periode?: 'bulan' | 'tahun';
  gaji?: number;
  lain?: number;
  pokok?: number;
  utang?: number;
}

export function penghasilan(i: InputPenghasilan, a: Acuan = ACUAN): Hasil {
  const periode = i.periode === 'tahun' ? 'tahun' : 'bulan';
  const bruto = n(i.gaji) + n(i.lain);
  const rincian: Rincian[] = [[`Penghasilan per ${periode}`, bruto]];
  let dasar: number;
  let nisab: number;
  if (i.metode === 'netto') {
    const pokok = n(i.pokok);
    const utang = n(i.utang);
    dasar = Math.max(0, bruto - pokok - utang);
    if (pokok) rincian.push(['Dikurangi kebutuhan pokok', -pokok]);
    if (utang) rincian.push(['Dikurangi cicilan/utang jatuh tempo', -utang]);
    rincian.push(['Penghasilan bersih', dasar]);
    const nisabTahun = NISAB_EMAS_G * n(a.emas24);
    nisab = periode === 'bulan' ? nisabTahun / 12 : nisabTahun;
  } else {
    dasar = bruto;
    nisab = periode === 'bulan' ? a.nisabPenghasilanBulanBaznas : a.nisabPenghasilanTahunBaznas;
  }
  const wajib = dasar > 0 && dasar >= nisab;
  return hasil({
    jenis: 'penghasilan', wajib, dasar, nisab, kadar: KADAR, rincian,
    alasan: wajib ? null : dasar === 0 ? 'kosong' : 'di-bawah-nisab',
  });
}

/* ---------- Simpanan (uang + emas + perak + investasi + piutang) ---------- */
export interface InputSimpanan {
  uang?: number;
  emasGram?: number;
  perakGram?: number;
  investasi?: number;
  piutang?: number;
  perhiasanGram?: number;
  karatPerhiasan?: number;
  /** Perhiasan yang dipakai: default tidak dihitung (Syafi'i, Maliki, Hanbali). */
  sertakanPerhiasan?: boolean;
  utang?: number;
  haul?: boolean;
  basis?: 'emas' | 'perak';
}

export function simpanan(i: InputSimpanan, a: Acuan = ACUAN): Hasil {
  const e24 = n(a.emas24);
  const pk = n(a.perak);
  const karat = Math.min(24, n(i.karatPerhiasan) || 24);
  const vUang = n(i.uang), vInv = n(i.investasi), vPiut = n(i.piutang);
  const vEmas = n(i.emasGram) * e24;
  const vPerhiasan = i.sertakanPerhiasan ? n(i.perhiasanGram) * e24 * (karat / 24) : 0;
  const vPerak = n(i.perakGram) * pk;
  const utang = n(i.utang);
  const dasar = Math.max(0, vUang + vInv + vPiut + vEmas + vPerhiasan + vPerak - utang);
  const nisab = i.basis === 'perak' ? NISAB_PERAK_G * pk : NISAB_EMAS_G * e24;

  const rincian: Rincian[] = [];
  if (vUang) rincian.push(['Uang & tabungan', vUang]);
  if (vEmas) rincian.push([`Emas ${fmtAngka(n(i.emasGram))} g`, vEmas]);
  if (vPerhiasan) rincian.push([`Perhiasan ${fmtAngka(n(i.perhiasanGram))} g (${karat}K)`, vPerhiasan]);
  if (vPerak) rincian.push([`Perak ${fmtAngka(n(i.perakGram))} g`, vPerak]);
  if (vInv) rincian.push(['Investasi', vInv]);
  if (vPiut) rincian.push(['Piutang lancar', vPiut]);
  if (utang) rincian.push(['Dikurangi utang jatuh tempo', -utang]);
  rincian.push(['Harta bersih', dasar]);

  const cukup = dasar > 0 && dasar >= nisab;
  const haul = i.haul !== false;
  const wajib = cukup && haul;
  return hasil({
    jenis: 'simpanan', wajib, dasar, nisab, kadar: KADAR, rincian,
    alasan: wajib ? null : dasar === 0 ? 'kosong' : !cukup ? 'di-bawah-nisab' : 'belum-haul',
  });
}

/* ---------- Perdagangan: aktiva lancar − kewajiban jangka pendek (PMA 52/2014 Ps. 12) ---------- */
export interface InputPerdagangan {
  kas?: number;
  piutang?: number;
  persediaan?: number;
  utang?: number;
  haul?: boolean;
}

export function perdagangan(i: InputPerdagangan, a: Acuan = ACUAN): Hasil {
  const kas = n(i.kas), piut = n(i.piutang), stok = n(i.persediaan), utang = n(i.utang);
  const dasar = Math.max(0, kas + piut + stok - utang);
  const nisab = NISAB_EMAS_G * n(a.emas24);
  const cukup = dasar > 0 && dasar >= nisab;
  const haul = i.haul !== false;
  const rincian: Rincian[] = ([
    ['Kas & saldo usaha', kas],
    ['Piutang lancar', piut],
    ['Persediaan (harga pasar)', stok],
  ] as Rincian[]).filter((r) => r[1]);
  if (utang) rincian.push(['Dikurangi utang jangka pendek', -utang]);
  rincian.push(['Aset lancar bersih', dasar]);
  return hasil({
    jenis: 'perdagangan', wajib: cukup && haul, dasar, nisab, kadar: KADAR, rincian,
    alasan: cukup && haul ? null : dasar === 0 ? 'kosong' : !cukup ? 'di-bawah-nisab' : 'belum-haul',
  });
}

/* ---------- Pertanian: nisab 653 kg gabah; 10% tadah hujan, 5% irigasi berbiaya ---------- */
export interface InputPertanian {
  komoditas?: 'padi' | 'lain';
  panenKg?: number;
  hargaKg?: number;
  pengairan?: 'hujan' | 'irigasi';
}

export function pertanian(i: InputPertanian, a: Acuan = ACUAN): Hasil {
  const kadar = i.pengairan === 'irigasi' ? 0.05 : 0.1;
  const lain = i.komoditas === 'lain';
  const kg = n(i.panenKg);
  const harga = n(i.hargaKg) || (lain ? 0 : n(a.gabahKg));
  const dasar = kg * harga;
  // padi: dibandingkan dalam kg; tanaman lain: nilai panen vs nilai 653 kg gabah
  const nisab = lain ? NISAB_GABAH_KG * n(a.gabahKg) : NISAB_GABAH_KG * harga;
  const wajib = lain ? kg > 0 && harga > 0 && dasar >= nisab : kg >= NISAB_GABAH_KG;
  return {
    ...hasil({
      jenis: 'pertanian', wajib, dasar, nisab, kadar,
      alasan: wajib ? null : kg === 0 ? 'kosong' : 'di-bawah-nisab',
      rincian: [['Hasil panen', `${fmtAngka(kg)} kg`], ['Harga per kg', harga], ['Nilai panen', dasar]],
    }),
    zakatKg: wajib ? Math.round(kg * kadar * 10) / 10 : 0,
    nisabKg: NISAB_GABAH_KG,
  };
}

/* ---------- Fitrah ---------- */
export interface InputFitrah {
  jiwa?: number;
  /** 2,5 kg (PMA 52/2014 & BAZNAS) atau 2,75 kg (ihtiyath). */
  kadarKg?: 2.5 | 2.75 | number;
  /** 'baznas' = nominal BAZNAS per jiwa, 'harga' = kg × harga beras lokal. */
  modeUang?: 'baznas' | 'harga';
  hargaBeras?: number;
}

export function fitrah(i: InputFitrah, a: Acuan = ACUAN): HasilFitrah {
  const jiwa = Math.floor(n(i.jiwa));
  const kadarKg = Number(i.kadarKg) === 2.75 ? 2.75 : 2.5;
  const zakatKg = Math.round(jiwa * kadarKg * 100) / 100;
  const rp = i.modeUang === 'harga' ? zakatKg * n(i.hargaBeras || a.berasKg) : jiwa * n(a.fitrahBaznas);
  return { jenis: 'fitrah', wajib: jiwa > 0, alasan: jiwa > 0 ? null : 'kosong', jiwa, kadarKg, zakatKg, zakat: Math.round(rp) };
}

/* ---------- Format ---------- */
const ribuan = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** 7640144 → "Rp7.640.144"; negatif memakai tanda minus (−). */
export function rupiah(x: number): string {
  const neg = x < 0;
  return (neg ? '−' : '') + 'Rp' + ribuan(String(Math.abs(Math.round(x))));
}

/** 1234.5 → "1.234,5" (maks 2 desimal). */
export function fmtAngka(x: number): string {
  const [i, d] = String(Math.round(n(x) * 100) / 100).split('.');
  return ribuan(i) + (d ? ',' + d : '');
}

/** "1.234,5" → 1234.5; teks asing diabaikan. */
export function parseAngka(s: string): number {
  const v = parseFloat(String(s ?? '').replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isFinite(v) ? v : 0;
}
