/**
 * Format input angka saat mengetik (pemisah ribuan titik, desimal koma) sambil menjaga posisi kursor.
 * Murni, supaya bisa diuji tanpa DOM.
 */

const ribuan = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Bentuk tampilan dari teks mentah. mode 'int' membuang koma; 'dec' mengizinkan satu koma + maks 2 digit. */
export function formatTampil(raw: string, mode: 'int' | 'dec' = 'int'): string {
  let s = String(raw ?? '').replace(/[^\d,]/g, '');
  if (mode === 'int') s = s.replace(/,/g, '');
  const [ip, ...rest] = s.split(',');
  const bulat = ip.replace(/^0+(?=\d)/, '');
  const depan = bulat === '' && rest.length ? '0' : bulat;
  if (mode === 'dec' && rest.length) return ribuan(depan) + ',' + rest.join('').slice(0, 2);
  return ribuan(depan);
}

/** Nilai numerik dari teks tampilan ("1.250,75" → 1250.75). */
export function nilaiDari(tampil: string): number {
  const v = parseFloat(String(tampil ?? '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(v) ? v : 0;
}

/**
 * Format ulang + hitung posisi kursor baru: jumlah digit/koma di kiri kursor dipertahankan,
 * jadi menyisipkan angka di tengah tidak melempar kursor ke akhir.
 */
export function formatDenganKursor(raw: string, kursor: number, mode: 'int' | 'dec' = 'int'): { value: string; kursor: number } {
  const penting = (c: string) => /\d/.test(c) || (mode === 'dec' && c === ',');
  const kiri = [...raw.slice(0, kursor)].filter(penting).length;
  const value = formatTampil(raw, mode);
  let hitung = 0;
  let pos = 0;
  if (kiri > 0) {
    for (; pos < value.length; pos++) {
      if (penting(value[pos])) hitung++;
      if (hitung === kiri) { pos++; break; }
    }
  }
  return { value, kursor: Math.min(pos, value.length) };
}
