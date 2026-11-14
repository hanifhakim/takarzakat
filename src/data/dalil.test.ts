import { describe, expect, it } from 'vitest';
import dalil from './dalil.json';

const JENIS = ['penghasilan', 'simpanan', 'perdagangan', 'pertanian', 'fitrah'];
const semua = Object.values(dalil.jenis).flatMap((j) => j.dalil);

describe('dalil.json', () => {
  it('memuat kelima jenis zakat', () => {
    expect(Object.keys(dalil.jenis).sort()).toEqual([...JENIS].sort());
  });
  it('setiap jenis punya khilaf, regulasi, dan minimal satu dalil', () => {
    for (const j of Object.values(dalil.jenis)) {
      expect(j.khilaf.length).toBeGreaterThan(20);
      expect(j.regulasi.length).toBeGreaterThan(10);
      expect(j.dalil.length).toBeGreaterThan(0);
    }
  });
  it.each(semua.map((d) => [d.rujukan, d]))('%s: lengkap & bersumber', (_, d) => {
    expect(d.ar).toMatch(/[\u0621-\u064A]/); // ada huruf Arab
    expect(d.terjemah.length).toBeGreaterThan(10);
    expect(d.url).toMatch(d.tipe === 'ayat' ? /^https:\/\/quran\.com\/\d+\/\d+$/ : /^https:\/\/sunnah\.com\/[a-z]+:\d+[a-z]?$/);
    if (d.tipe === 'hadis') expect('derajat' in d && d.derajat).toBeTruthy();
  });
  it('hadis dha\u2019if ditandai lemah', () => {
    for (const d of semua) {
      if ('derajat' in d && /da?h?a\u2019?if/i.test(String(d.derajat))) expect('lemah' in d && d.lemah).toBe(true);
    }
  });
});
