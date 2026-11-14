import { describe, expect, it, vi } from 'vitest';

// Fixture tetap: tes tidak boleh ikut berubah saat acuan.json diperbarui.
vi.mock('../../data/acuan.json', async (asli) => {
  const m = (await asli()) as { default: Record<string, Record<string, unknown>> };
  return { default: { ...m.default, diperbarui: '2026-11-13', emas24: { ...m.default.emas24, nilai: 2_509_000 }, perak: { ...m.default.perak, nilai: 34_300 } } };
});
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
    expect(html).toContain('data-set="metode:baznas" aria-pressed="true"');
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
