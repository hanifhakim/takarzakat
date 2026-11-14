import { describe, expect, it } from 'vitest';
import { ACUAN } from './zakat';
import { gabung, labelHarga } from './acuan-store';
import type { HargaLive } from './harga';

const LIVE: HargaLive = {
  status: 'live', emas24: 2_280_429, perak: 28_538, kursUsdIdr: 18245, xauUsd: 3887.6, xagUsd: 48.65,
  waktuHarga: '2026-11-14T03:41:44Z', tanggalKurs: '2026-11-13',
  sumber: { emas: 'gold-api.com', kurs: 'Frankfurter' }, diambil: '2026-11-14T03:45:00Z',
};

describe('gabung: prioritas manual > live > bawaan', () => {
  it('tanpa live & tanpa ubahan → bawaan', () => {
    const a = gabung(null);
    expect(a.sumberHarga).toBe('bawaan');
    expect(a.emas24).toBe(ACUAN.emas24);
  });
  it('live mengganti emas & perak', () => {
    const a = gabung(null, ACUAN, LIVE);
    expect(a).toMatchObject({ sumberHarga: 'live', emas24: 2_280_429, perak: 28_538, diubah: false });
  });
  it('live tidak valid diabaikan', () => {
    expect(gabung(null, ACUAN, { ...LIVE, emas24: 1 }).sumberHarga).toBe('bawaan');
  });
  it('ubahan manual menang atas live', () => {
    const a = gabung({ emas24: 2_000_000 }, ACUAN, LIVE);
    expect(a).toMatchObject({ sumberHarga: 'manual', emas24: 2_000_000, perak: 28_538, diubah: true });
  });
  it('ubahan beras saja tidak mengubah label sumber harga emas', () => {
    expect(gabung({ berasKg: 16_000 }, ACUAN, LIVE)).toMatchObject({ sumberHarga: 'live', berasKg: 16_000, diubah: true });
  });
  it('nilai tidak valid & kunci yang tidak boleh diubah diabaikan', () => {
    const a = gabung({ emas24: -1, perak: 'x', berasKg: 1e12, gabahKg: 7000, nisabPenghasilanBulanBaznas: 1 });
    expect(a.emas24).toBe(ACUAN.emas24);
    expect(a.gabahKg).toBe(7000);
    expect(a.nisabPenghasilanBulanBaznas).toBe(ACUAN.nisabPenghasilanBulanBaznas);
  });
});

describe('labelHarga', () => {
  const t = Date.parse('2026-11-14T03:41:44Z');
  it('live: menit / jam lalu', () => {
    const a = gabung(null, ACUAN, LIVE);
    expect(labelHarga(a, t + 20_000)).toBe('harga emas dunia · baru saja');
    expect(labelHarga(a, t + 12 * 60_000)).toBe('harga emas dunia · 12 menit lalu');
    expect(labelHarga(a, t + 3 * 3600_000)).toBe('harga emas dunia · 3 jam lalu');
  });
  it('manual & bawaan', () => {
    expect(labelHarga(gabung({ emas24: 2e6 }))).toBe('diubah manual');
    expect(labelHarga(gabung(null))).toMatch(/^bawaan \d+ \w+ 2026$/);
  });
});
