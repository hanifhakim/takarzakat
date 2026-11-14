import { describe, expect, it } from 'vitest';
import { bacaGoldApi, bacaKurs, hargaValid, perGram, susun } from './harga';

// Respons nyata 14 Nov 2026 (dipotong)
const XAU = { currency: 'USD', name: 'Gold', price: 3887.600098, symbol: 'XAU', updatedAt: '2026-11-14T03:41:44Z' };
const XAG = { currency: 'USD', name: 'Silver', price: 48.650002, symbol: 'XAG', updatedAt: '2026-11-14T03:41:43Z' };
const FRANK = { amount: 1, base: 'USD', date: '2026-11-13', rates: { IDR: 18245 } };
const ERAPI = { result: 'success', time_last_update_utc: 'Sat, 14 Nov 2026 00:02:31 +0000', rates: { IDR: 18250.5 } };

describe('perGram', () => {
  it('USD/oz × kurs ÷ 31,1034768', () => {
    expect(perGram(3887.600098, 18245)).toBe(2_280_429);
    expect(perGram(48.650002, 18245)).toBe(28_538);
  });
  it('mendekati harga emas dunia yang dipakai lembaga (±1%)', () => {
    const g = perGram(XAU.price, FRANK.rates.IDR);
    expect(Math.abs(g - 2_281_134) / 2_281_134).toBeLessThan(0.01); // Dompet Dhuafa, 13 Nov
  });
});

describe('bacaGoldApi', () => {
  it('membaca harga & waktu', () => {
    expect(bacaGoldApi(XAU, 'XAU')).toEqual({ usd: 3887.600098, waktu: '2026-11-14T03:41:44Z' });
  });
  it('menolak simbol salah, harga di luar batas, atau rusak', () => {
    expect(() => bacaGoldApi(XAG, 'XAU')).toThrow();
    expect(() => bacaGoldApi({ ...XAU, price: 3 }, 'XAU')).toThrow();
    expect(() => bacaGoldApi({ ...XAU, price: 'abc' }, 'XAU')).toThrow();
    expect(() => bacaGoldApi(null, 'XAU')).toThrow();
    expect(() => bacaGoldApi({ error: 'x' }, 'XAG')).toThrow();
  });
  it('waktu tidak valid diganti waktu sekarang', () => {
    expect(Date.parse(bacaGoldApi({ ...XAU, updatedAt: 'kemarin' }, 'XAU').waktu)).not.toBeNaN();
  });
});

describe('bacaKurs', () => {
  it('Frankfurter', () => expect(bacaKurs(FRANK)).toEqual({ idr: 18245, tanggal: '2026-11-13' }));
  it('open.er-api', () => expect(bacaKurs(ERAPI)).toEqual({ idr: 18250.5, tanggal: '2026-11-14' }));
  it('menolak kurs tidak masuk akal', () => {
    expect(() => bacaKurs({ rates: { IDR: 1 } })).toThrow();
    expect(() => bacaKurs({ rates: {} })).toThrow();
    expect(() => bacaKurs(undefined)).toThrow();
  });
});

describe('susun & hargaValid', () => {
  const h = susun(bacaGoldApi(XAU, 'XAU'), bacaGoldApi(XAG, 'XAG'), bacaKurs(FRANK), 'Frankfurter (ECB)', new Date('2026-11-14T03:45:00Z'));
  it('menghasilkan objek live lengkap', () => {
    expect(h).toMatchObject({ status: 'live', emas24: 2_280_429, perak: 28_538, kursUsdIdr: 18245, tanggalKurs: '2026-11-13', diambil: '2026-11-14T03:45:00.000Z' });
    expect(hargaValid(h)).toBe(true);
  });
  it('hargaValid menolak respons gagal atau angka aneh', () => {
    expect(hargaValid({ status: 'gagal' })).toBe(false);
    expect(hargaValid({ ...h, emas24: 5 })).toBe(false);
    expect(hargaValid({ ...h, perak: NaN })).toBe(false);
    expect(hargaValid(null)).toBe(false);
  });
});
