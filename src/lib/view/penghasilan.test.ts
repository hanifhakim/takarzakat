import { describe, expect, it } from 'vitest';
import { ACUAN } from '../zakat';
import { gabung } from '../acuan-store';
import { esc, renderHasil, teksSalin, type StatePenghasilan } from './penghasilan';

const s = (o: Partial<StatePenghasilan> = {}): StatePenghasilan =>
  ({ metode: 'baznas', periode: 'bulan', gaji: 0, lain: 0, pokok: 0, utang: 0, ...o });

describe('renderHasil penghasilan', () => {
  it('kosong: status menunggu, tanpa rincian/meter', () => {
    const { html, ring } = renderHasil(s(), ACUAN);
    expect(ring.kosong).toBe(true);
    expect(html).toContain('Menunggu isian');
    expect(html).not.toContain('class="meter"');
    expect(html).not.toContain('Kenapa hasil bisa berbeda');
  });
  it('10 jt BAZNAS: wajib Rp250.000 + rumus + perbandingan berbeda', () => {
    const { html } = renderHasil(s({ gaji: 10e6 }), ACUAN);
    expect(html).toContain('Wajib zakat');
    expect(html).toContain('Rp250.000');
    expect(html).toContain('2,5% × Rp10.000.000 = Rp250.000');
    expect(html).toContain('dua metode memberi jawaban berbeda');
    expect(html).toContain('data-cmp="baznas" aria-pressed="true"');
  });
  it('di bawah nisab: belum wajib, nominal Rp0, ada ajakan sedekah, tanpa rumus', () => {
    const { html } = renderHasil(s({ gaji: 5e6 }), ACUAN);
    expect(html).toContain('Belum wajib');
    expect(html).toContain('bersedekah');
    expect(html).not.toContain('class="formula"');
  });
  it('kedua metode sepakat untuk penghasilan besar', () => {
    const { html } = renderHasil(s({ gaji: 50e6 }), ACUAN);
    expect(html).toContain('kedua metode sepakat');
  });
  it('netto memakai harga emas dari acuan (termasuk ubahan pengguna)', () => {
    const a = gabung({ emas24: 1_200_000 });
    const { r } = renderHasil(s({ gaji: 10e6, metode: 'netto' }), a);
    expect(r.nisab).toBe(8_500_000); // 85 × 1,2 jt / 12
    expect(r.wajib).toBe(true);
  });
});

describe('acuan-store.gabung', () => {
  it('mengabaikan nilai tidak valid', () => {
    const a = gabung({ emas24: -1, perak: 'x', berasKg: 1e12, gabahKg: 7000, nisabPenghasilanBulanBaznas: 1 });
    expect(a.emas24).toBe(ACUAN.emas24);
    expect(a.perak).toBe(ACUAN.perak);
    expect(a.berasKg).toBe(ACUAN.berasKg);
    expect(a.gabahKg).toBe(7000);
    expect(a.nisabPenghasilanBulanBaznas).toBe(ACUAN.nisabPenghasilanBulanBaznas); // tidak bisa diubah pengguna
    expect(a.diubah).toBe(true);
  });
  it('null / sama dengan bawaan → tidak diubah', () => {
    expect(gabung(null).diubah).toBe(false);
    expect(gabung({ emas24: ACUAN.emas24 }).diubah).toBe(false);
  });
});

describe('teksSalin & esc', () => {
  it('teks salin memuat metode, nisab, zakat', () => {
    const t = teksSalin(s({ gaji: 10e6 }), ACUAN);
    expect(t).toContain('Metode: BAZNAS');
    expect(t).toContain('Nisab: Rp7.640.144');
    expect(t).toContain('Zakat: Rp250.000');
  });
  it('esc menetralkan HTML', () => {
    expect(esc('<img onerror=x>"\'&')).toBe('&lt;img onerror=x&gt;&quot;&#39;&amp;');
  });
});
