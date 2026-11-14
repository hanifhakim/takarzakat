import { describe, expect, it } from 'vitest';
import { formatDenganKursor, formatTampil, nilaiDari } from './input';

describe('formatTampil', () => {
  it('ribuan memakai titik', () => {
    expect(formatTampil('10000000')).toBe('10.000.000');
    expect(formatTampil('1234')).toBe('1.234');
    expect(formatTampil('999')).toBe('999');
  });
  it('kosong tetap kosong (tidak ada 0 bawaan)', () => {
    expect(formatTampil('')).toBe('');
    expect(formatTampil('abc')).toBe('');
  });
  it('membuang nol di depan dan karakter asing', () => {
    expect(formatTampil('0010000')).toBe('10.000');
    expect(formatTampil('Rp 5.000.000')).toBe('5.000.000');
    expect(formatTampil('0')).toBe('0');
  });
  it('mode int membuang koma', () => {
    expect(formatTampil('1000,5')).toBe('10.005');
  });
  it('mode dec: satu koma, maks 2 desimal', () => {
    expect(formatTampil('1250,755', 'dec')).toBe('1.250,75');
    expect(formatTampil('12,3,4', 'dec')).toBe('12,34');
    expect(formatTampil(',5', 'dec')).toBe('0,5');
    expect(formatTampil('30,', 'dec')).toBe('30,');
  });
});

describe('nilaiDari', () => {
  it('kebalikan formatTampil', () => {
    expect(nilaiDari('10.000.000')).toBe(10_000_000);
    expect(nilaiDari('1.250,75')).toBe(1250.75);
    expect(nilaiDari('')).toBe(0);
  });
});

describe('formatDenganKursor', () => {
  it('mengetik di akhir: kursor di akhir', () => {
    expect(formatDenganKursor('10000', 5)).toEqual({ value: '10.000', kursor: 6 });
  });
  it('menyisipkan digit di tengah tidak melompat ke akhir', () => {
    // "1.000.000" lalu ketik "5" setelah "1." → "1.5000.000" (kursor 3)
    const r = formatDenganKursor('1.5000.000', 3);
    expect(r.value).toBe('15.000.000');
    expect(r.value.slice(0, r.kursor)).toBe('15');
  });
  it('menghapus digit di tengah', () => {
    // "15.000.000", hapus "5" → "1.000.000" dengan kursor setelah "1"
    const r = formatDenganKursor('1.000.000', 1);
    expect(r.value).toBe('1.000.000');
    expect(r.kursor).toBe(1);
  });
  it('kursor di awal tetap di awal', () => {
    expect(formatDenganKursor('5000', 0).kursor).toBe(0);
  });
  it('mode dec menghitung koma', () => {
    const r = formatDenganKursor('1250,7', 6, 'dec');
    expect(r).toEqual({ value: '1.250,7', kursor: 7 });
  });
});
