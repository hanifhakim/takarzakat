import { describe, expect, it, vi } from 'vitest';

// Fixture tetap: tes tidak boleh ikut berubah saat acuan.json diperbarui.
vi.mock('../data/acuan.json', async (asli) => {
  const m = (await asli()) as { default: Record<string, Record<string, unknown>> };
  return { default: { ...m.default, diperbarui: '2026-11-13', emas24: { ...m.default.emas24, nilai: 2_509_000 }, perak: { ...m.default.perak, nilai: 34_300 } } };
});
import {
  ACUAN, fitrah, fmtAngka, parseAngka, penghasilan, perdagangan, pertanian, rupiah, simpanan,
} from './zakat';

const emas2jt = { ...ACUAN, emas24: 2_000_000 };

describe('acuan', () => {
  it('memuat angka resmi SK BAZNAS 15/2026', () => {
    expect(ACUAN.nisabPenghasilanBulanBaznas).toBe(7_640_144);
    expect(ACUAN.nisabPenghasilanTahunBaznas).toBe(91_681_728);
    expect(ACUAN.fitrahBaznas).toBe(50_000);
  });
});

describe('penghasilan · BAZNAS (bruto)', () => {
  it('10 jt/bln → wajib Rp250.000 (contoh resmi baznas.go.id)', () => {
    const r = penghasilan({ gaji: 10e6, metode: 'baznas', periode: 'bulan' });
    expect(r.wajib).toBe(true);
    expect(r.zakat).toBe(250_000);
    expect(r.nisab).toBe(7_640_144);
  });
  it('120 jt/thn → Rp3.000.000 (contoh resmi)', () => {
    const r = penghasilan({ gaji: 120e6, metode: 'baznas', periode: 'tahun' });
    expect(r.zakat).toBe(3_000_000);
    expect(r.nisab).toBe(91_681_728);
  });
  it('tepat di nisab → wajib', () => {
    expect(penghasilan({ gaji: 7_640_144 }).wajib).toBe(true);
  });
  it('Rp1 di bawah nisab → tidak wajib, zakat 0', () => {
    const r = penghasilan({ gaji: 7_640_143 });
    expect(r.wajib).toBe(false);
    expect(r.zakat).toBe(0);
    expect(r.alasan).toBe('di-bawah-nisab');
  });
  it('gaji + penghasilan lain dijumlah', () => {
    expect(penghasilan({ gaji: 8e6, lain: 2e6 }).zakat).toBe(250_000);
  });
  it('mengabaikan kebutuhan pokok (bruto)', () => {
    expect(penghasilan({ gaji: 10e6, pokok: 5e6, metode: 'baznas' }).zakat).toBe(250_000);
  });
  it('metode default = baznas, periode default = bulan', () => {
    expect(penghasilan({ gaji: 10e6 }).nisab).toBe(7_640_144);
  });
});

describe('penghasilan · bersih (MUI 2018 / Muhammadiyah, emas 24K)', () => {
  it('nisab bulanan = 85 × 2.509.000 / 12 = 17.772.083', () => {
    expect(penghasilan({ gaji: 1, metode: 'netto' }).nisab).toBe(17_772_083);
  });
  it('10 jt/bln → belum wajib', () => {
    expect(penghasilan({ gaji: 10e6, metode: 'netto' }).wajib).toBe(false);
  });
  it('25 jt − pokok 5 jt = 20 jt → Rp500.000', () => {
    const r = penghasilan({ gaji: 25e6, pokok: 5e6, metode: 'netto' });
    expect(r.dasar).toBe(20e6);
    expect(r.zakat).toBe(500_000);
  });
  it('utang jatuh tempo ikut dikurangkan', () => {
    const r = penghasilan({ gaji: 30e6, pokok: 5e6, utang: 3e6, metode: 'netto' });
    expect(r.dasar).toBe(22e6);
    expect(r.zakat).toBe(550_000);
  });
  it('pokok > gaji → 0, tidak negatif', () => {
    const r = penghasilan({ gaji: 3e6, pokok: 5e6, metode: 'netto' });
    expect(r.dasar).toBe(0);
    expect(r.zakat).toBe(0);
  });
  it('contoh Muhammadiyah: bersih 22,8 jt/thn → belum wajib', () => {
    expect(penghasilan({ gaji: 22.8e6, metode: 'netto', periode: 'tahun' }).wajib).toBe(false);
  });
});

describe('penghasilan · input tidak valid', () => {
  it('negatif / teks / NaN / Infinity dianggap 0', () => {
    const r = penghasilan({ gaji: -5, lain: 'abc' as unknown as number, pokok: NaN, utang: Infinity, metode: 'netto' });
    expect(r.dasar).toBe(0);
    expect(r.alasan).toBe('kosong');
  });
});

describe('simpanan', () => {
  it('nisab emas = 85 × 2.509.000 = 213.265.000', () => {
    expect(simpanan({ uang: 1 }).nisab).toBe(213_265_000);
  });
  it('contoh BAZNAS: emas 100 g @Rp2 jt → Rp5.000.000', () => {
    const r = simpanan({ emasGram: 100 }, emas2jt);
    expect(r.wajib).toBe(true);
    expect(r.zakat).toBe(5_000_000);
  });
  it('tabungan 250 jt − utang 20 jt → Rp5.750.000', () => {
    expect(simpanan({ uang: 250e6, utang: 20e6 }).zakat).toBe(5_750_000);
  });
  it('gabungan uang + emas mencapai nisab walau masing-masing tidak', () => {
    const r = simpanan({ uang: 150e6, emasGram: 30 });
    expect(r.wajib).toBe(true);
    expect(r.zakat).toBe(Math.round(225_270_000 * 0.025));
  });
  it('belum haul → tidak wajib, alasan belum-haul', () => {
    const r = simpanan({ uang: 300e6, haul: false });
    expect(r.wajib).toBe(false);
    expect(r.alasan).toBe('belum-haul');
  });
  it('perhiasan dipakai tidak dihitung secara default', () => {
    expect(simpanan({ perhiasanGram: 100 }).dasar).toBe(0);
  });
  it('perhiasan disertakan, 18K: 100 g × 2.509.000 × 18/24', () => {
    const r = simpanan({ perhiasanGram: 100, sertakanPerhiasan: true, karatPerhiasan: 18 });
    expect(r.dasar).toBe(188_175_000);
    expect(r.wajib).toBe(false);
  });
  it('karat > 24 dibatasi 24', () => {
    expect(simpanan({ perhiasanGram: 10, sertakanPerhiasan: true, karatPerhiasan: 30 }).dasar).toBe(25_090_000);
  });
  it('basis perak: nisab 595 × 34.300 = 20.408.500; 25 jt → Rp625.000', () => {
    const r = simpanan({ uang: 25e6, basis: 'perak' });
    expect(r.nisab).toBe(20_408_500);
    expect(r.zakat).toBe(625_000);
  });
  it('utang melebihi harta → 0', () => {
    expect(simpanan({ uang: 10e6, utang: 50e6 }).dasar).toBe(0);
  });
  it('rincian diakhiri harta bersih', () => {
    const r = simpanan({ uang: 1e6, emasGram: 1.5 });
    expect(r.rincian.at(-1)).toEqual(['Harta bersih', 1e6 + 1.5 * 2_509_000]);
    expect(r.rincian[1][0]).toBe('Emas 1,5 g');
  });
});

describe('perdagangan', () => {
  it('kas 100 + piutang 50 + stok 150 − utang 60 = 240 jt → Rp6.000.000', () => {
    const r = perdagangan({ kas: 100e6, piutang: 50e6, persediaan: 150e6, utang: 60e6 });
    expect(r.dasar).toBe(240e6);
    expect(r.zakat).toBe(6_000_000);
  });
  it('200 jt di bawah nisab 213,265 jt', () => {
    expect(perdagangan({ persediaan: 200e6 }).wajib).toBe(false);
  });
  it('belum haul', () => {
    expect(perdagangan({ kas: 500e6, haul: false }).alasan).toBe('belum-haul');
  });
});

describe('pertanian', () => {
  it('padi 1.000 kg tadah hujan → 100 kg (10%), setara Rp650.000', () => {
    const r = pertanian({ panenKg: 1000, pengairan: 'hujan' });
    expect(r.wajib).toBe(true);
    expect(r.zakatKg).toBe(100);
    expect(r.zakat).toBe(650_000);
  });
  it('padi 1.000 kg irigasi → 50 kg (5%)', () => {
    expect(pertanian({ panenKg: 1000, pengairan: 'irigasi' }).zakatKg).toBe(50);
  });
  it('batas: 653 kg wajib, 652 kg tidak', () => {
    expect(pertanian({ panenKg: 653 }).wajib).toBe(true);
    expect(pertanian({ panenKg: 652 }).wajib).toBe(false);
  });
  it('tanaman lain: jagung 1.500 kg @Rp5.000 → Rp750.000 (10%)', () => {
    const r = pertanian({ komoditas: 'lain', panenKg: 1500, hargaKg: 5000, pengairan: 'hujan' });
    expect(r.nisab).toBe(4_244_500);
    expect(r.wajib).toBe(true);
    expect(r.zakat).toBe(750_000);
  });
  it('tanaman lain tanpa harga → tidak bisa dinilai', () => {
    expect(pertanian({ komoditas: 'lain', panenKg: 5000 }).wajib).toBe(false);
  });
  it('rincian berat memakai format Indonesia', () => {
    expect(pertanian({ panenKg: 1234.5 }).rincian[0]).toEqual(['Hasil panen', '1.234,5 kg']);
  });
});

describe('fitrah', () => {
  it('4 jiwa × 2,5 kg = 10 kg; nominal BAZNAS Rp200.000', () => {
    const r = fitrah({ jiwa: 4 });
    expect(r.zakatKg).toBe(10);
    expect(r.zakat).toBe(200_000);
  });
  it('3 jiwa × 2,75 kg @Rp16.000 = 8,25 kg → Rp132.000', () => {
    const r = fitrah({ jiwa: 3, kadarKg: 2.75, modeUang: 'harga', hargaBeras: 16_000 });
    expect(r.zakatKg).toBe(8.25);
    expect(r.zakat).toBe(132_000);
  });
  it('kadar selain 2,75 jatuh ke 2,5', () => {
    expect(fitrah({ jiwa: 1, kadarKg: 3 }).kadarKg).toBe(2.5);
  });
  it('jiwa pecahan dibulatkan ke bawah; 0 jiwa → kosong', () => {
    expect(fitrah({ jiwa: 2.9 }).jiwa).toBe(2);
    expect(fitrah({ jiwa: 0 }).alasan).toBe('kosong');
  });
});

describe('format', () => {
  it('rupiah', () => {
    expect(rupiah(7_640_144)).toBe('Rp7.640.144');
    expect(rupiah(-5e6)).toBe('−Rp5.000.000');
    expect(rupiah(0)).toBe('Rp0');
  });
  it('fmtAngka & parseAngka bolak-balik', () => {
    expect(fmtAngka(1250.75)).toBe('1.250,75');
    expect(parseAngka('1.250,75')).toBe(1250.75);
    expect(parseAngka('Rp 10.000.000')).toBe(10e6);
    expect(parseAngka('')).toBe(0);
  });
});
