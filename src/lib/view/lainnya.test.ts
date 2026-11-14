import { describe, expect, it, vi } from 'vitest';

// Fixture tetap: tes tidak boleh ikut berubah saat acuan.json diperbarui.
vi.mock('../../data/acuan.json', async (asli) => {
  const m = (await asli()) as { default: Record<string, Record<string, unknown>> };
  return { default: { ...m.default, diperbarui: '2026-11-13', emas24: { ...m.default.emas24, nilai: 2_509_000 }, perak: { ...m.default.perak, nilai: 34_300 } } };
});

import { ACUAN } from '../zakat';
import * as Sim from './simpanan';
import * as Dag from './perdagangan';
import * as Tani from './pertanian';
import * as Fit from './fitrah';

describe('simpanan', () => {
  const s = (o: Partial<Sim.StateSimpanan> = {}) => ({ ...Sim.AWAL_SIMPANAN, ...o });
  it('kosong → menunggu isian, tanpa tabel', () => {
    const { html, ring } = Sim.renderHasil(s(), ACUAN);
    expect(ring.kosong).toBe(true);
    expect(html).not.toContain('class="rows"');
  });
  it('uang 150 jt + emas 30 g → wajib (gabungan) + pilihan emas/perak', () => {
    const { html, ring } = Sim.renderHasil(s({ uang: 150e6, emasGram: 30 }), ACUAN);
    expect(ring.status).toBe('Wajib zakat');
    expect(ring.angka).toBe('Rp5.631.750');
    expect(html).toContain('Patokan nisab: emas atau perak?');
    expect(html).toContain('data-set="basis:emas" aria-pressed="true"');
  });
  it('harta yang tidak dicentang tidak dihitung', () => {
    const r = Sim.hitung(s({ punya: ['uang'], uang: 10e6, emasGram: 500 }), ACUAN);
    expect(r.dasar).toBe(10e6);
  });
  it('perhiasan: perlu dicentang DAN disertakan', () => {
    expect(Sim.hitung(s({ punya: ['perhiasan'], perhiasanGram: 100, sertakanPerhiasan: false }), ACUAN).dasar).toBe(0);
    expect(Sim.hitung(s({ punya: ['perhiasan'], perhiasanGram: 100, sertakanPerhiasan: true, karatPerhiasan: 18 }), ACUAN).dasar).toBe(188_175_000);
  });
  it('belum haul → status Belum haul (kuning)', () => {
    const { ring, html } = Sim.renderHasil(s({ uang: 300e6, haul: false }), ACUAN);
    expect(ring).toMatchObject({ status: 'Belum haul', kelas: 'wait' });
    expect(html).toContain('belum genap satu tahun');
  });
  it('25 jt: emas belum wajib, perak wajib Rp625.000', () => {
    const emas = Sim.renderHasil(s({ uang: 25e6 }), ACUAN);
    expect(emas.ring.status).toBe('Belum wajib');
    expect(emas.html).toContain('Rp625.000'); // kartu perak
    expect(Sim.renderHasil(s({ uang: 25e6, basis: 'perak' }), ACUAN).ring.angka).toBe('Rp625.000');
  });
  it('teks salin', () => {
    expect(Sim.teksSalin(s({ uang: 250e6 }), ACUAN)).toContain('Zakat: Rp6.250.000');
  });
});

describe('perdagangan', () => {
  const s = (o: Partial<Dag.StatePerdagangan> = {}) => ({ ...Dag.AWAL_PERDAGANGAN, ...o });
  it('240 jt bersih → Rp6.000.000', () => {
    const { ring, html } = Dag.renderHasil(s({ kas: 100e6, piutang: 50e6, persediaan: 150e6, utang: 60e6 }), ACUAN);
    expect(ring.angka).toBe('Rp6.000.000');
    expect(html).toContain('2,5% × Rp240.000.000 = Rp6.000.000');
    expect(html).toContain('Dikurangi utang jangka pendek');
  });
  it('di bawah nisab & belum haul', () => {
    expect(Dag.renderHasil(s({ persediaan: 200e6 }), ACUAN).ring.status).toBe('Belum wajib');
    expect(Dag.renderHasil(s({ kas: 500e6, haul: false }), ACUAN).ring.status).toBe('Belum haul');
  });
});

describe('pertanian', () => {
  const s = (o: Partial<Tani.StatePertanian> = {}) => ({ ...Tani.AWAL_PERTANIAN, ...o });
  it('padi 1.200 kg tadah hujan → 120 kg, setara Rp780.000', () => {
    const { ring, html } = Tani.renderHasil(s({ panenKg: 1200 }), ACUAN);
    expect(ring.angka).toBe('120 kg');
    expect(html).toContain('setara Rp780.000');
    expect(html).toContain('10% × 1.200 kg = 120 kg');
    expect(html).toContain('Nisab 653 kg');
  });
  it('padi irigasi → 5%', () => {
    expect(Tani.renderHasil(s({ panenKg: 1200, pengairan: 'irigasi' }), ACUAN).ring.angka).toBe('60 kg');
  });
  it('padi 652 kg → belum wajib', () => {
    expect(Tani.renderHasil(s({ panenKg: 652 }), ACUAN).ring.status).toBe('Belum wajib');
  });
  it('tanaman lain: dinilai rupiah', () => {
    const { ring, html } = Tani.renderHasil(s({ komoditas: 'lain', panenKg: 1500, hargaKg: 5000 }), ACUAN);
    expect(ring.angka).toBe('Rp750.000');
    expect(html).toContain('setara 150 kg');
  });
  it('tanaman lain tanpa harga → minta harga, tanpa tabel', () => {
    const { html, ring } = Tani.renderHasil(s({ komoditas: 'lain', panenKg: 5000 }), ACUAN);
    expect(ring.status).toBe('Belum wajib');
    expect(html).toContain('Isi harga per kg');
    expect(html).not.toContain('class="rows"');
  });
});

describe('fitrah', () => {
  const s = (o: Partial<Fit.StateFitrah> = {}) => ({ ...Fit.AWAL_FITRAH, ...o });
  it('awal 1 jiwa BAZNAS → Rp50.000, setara 2,5 kg', () => {
    const { ring, html } = Fit.renderHasil(s(), ACUAN);
    expect(ring.angka).toBe('Rp50.000');
    expect(html).toContain('setara 2,5 kg beras');
  });
  it('4 jiwa beras → 10 kg beras', () => {
    expect(Fit.renderHasil(s({ jiwa: 4, bayar: 'beras' }), ACUAN).ring.angka).toBe('10 kg beras');
  });
  it('3 jiwa 2,75 kg harga lokal Rp16.000 → Rp132.000', () => {
    expect(Fit.renderHasil(s({ jiwa: 3, kadarKg: 2.75, bayar: 'harga', hargaBeras: 16000 }), ACUAN).ring.angka).toBe('Rp132.000');
  });
  it('2,75 kg + nominal BAZNAS → catatan', () => {
    expect(Fit.renderHasil(s({ kadarKg: 2.75 }), ACUAN).html).toContain('Nominal BAZNAS dihitung dari 2,5 kg');
  });
  it('harga lokal kosong → pakai acuan beras', () => {
    expect(Fit.renderHasil(s({ jiwa: 2, bayar: 'harga' }), ACUAN).ring.angka).toBe('Rp100.000');
  });
});
