/**
 * Tampilan hasil zakat penghasilan sebagai string HTML (murni → bisa diuji).
 * Teks dari pengguna tidak pernah masuk ke HTML; label berasal dari zakat.ts dan tetap di-escape.
 */
import { penghasilan, rupiah, type Acuan, type Hasil, type InputPenghasilan } from '../zakat';

export interface StatePenghasilan extends Required<Pick<InputPenghasilan, 'metode' | 'periode'>> {
  gaji: number; lain: number; pokok: number; utang: number;
}

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const pct = (k: number) => String(+(k * 100).toFixed(2)).replace('.', ',') + '%';

export interface Ringkas { status: string; kelas: '' | 'yes' | 'wait'; angka: string; per: string; kosong: boolean }

export function ringkas(r: Hasil, s: StatePenghasilan): Ringkas {
  const per = s.periode === 'bulan' ? 'per bulan' : 'per tahun';
  if (r.alasan === 'kosong') return { status: 'Menunggu isian', kelas: '', angka: rupiah(0), per, kosong: true };
  return r.wajib
    ? { status: 'Wajib zakat', kelas: 'yes', angka: rupiah(r.zakat), per, kosong: false }
    : { status: 'Belum wajib', kelas: '', angka: rupiah(0), per, kosong: false };
}

export function meter(r: Hasil): string {
  if (!r.nisab) return '';
  const max = Math.max(r.dasar, r.nisab) * 1.15;
  const w = Math.min(100, (r.dasar / max) * 100);
  const m = (r.nisab / max) * 100;
  return `<div class="meter" aria-hidden="true"><div class="track"><div class="fill${r.dasar >= r.nisab ? '' : ' below'}" style="width:${w.toFixed(2)}%"></div><div class="mark" style="left:${m.toFixed(2)}%"></div></div>`
    + `<div class="legend2"><span>Dihitung ${rupiah(r.dasar)}</span><span><b>│</b> Nisab ${rupiah(r.nisab)}</span></div></div>`;
}

function rincian(r: Hasil, metode: StatePenghasilan['metode']): string {
  const rows = r.rincian.map(([l, v], i) => {
    const total = i === r.rincian.length - 1 && r.rincian.length > 1;
    return `<tr${total ? ' class="total"' : ''}><td>${esc(l)}</td><td>${typeof v === 'number' ? rupiah(v) : esc(v)}</td></tr>`;
  }).join('');
  const rumus = r.wajib ? `<p class="formula">${pct(r.kadar)} × ${rupiah(r.dasar)} = ${rupiah(r.zakat)}</p>` : '';
  return `<div class="r-body"><table class="rows"><caption class="sr-only">Rincian perhitungan</caption><tbody>${rows}`
    + `<tr><td>Nisab ${metode === 'netto' ? '(85 g emas 24K)' : '(SK BAZNAS 15/2026)'}</td><td>${rupiah(r.nisab)}</td></tr></tbody></table>${rumus}</div>`;
}

export function bandingkan(s: StatePenghasilan, a: Acuan): string {
  const b = penghasilan({ ...s, metode: 'baznas' }, a);
  const n = penghasilan({ ...s, metode: 'netto' }, a);
  const kartu = (key: 'baznas' | 'netto', judul: string, r: Hasil) =>
    `<button type="button" data-cmp="${key}" aria-pressed="${s.metode === key}"><span class="t">${judul}</span>`
    + `<span class="v">${r.wajib ? rupiah(r.zakat) : 'Belum wajib'}</span><span class="s">Nisab ${rupiah(r.nisab)}</span></button>`;
  const sepakat = b.wajib === n.wajib;
  return `<div class="compare"><h3>Kenapa hasil bisa berbeda?</h3><p>`
    + (sepakat ? 'Dengan angkamu, kedua metode sepakat soal wajib atau tidaknya; nominalnya bisa berbeda.' : 'Dengan angkamu, dua metode memberi jawaban berbeda.')
    + ' BAZNAS memakai harga <b>emas 14 karat</b> dan penghasilan <b>kotor</b>. MUI (Ijtima\u2019 Ulama 2018) dan Muhammadiyah menghitung dari penghasilan <b>bersih</b>; Muhammadiyah memakai <b>emas 24 karat</b>. Keduanya pendapat yang diakui; ikuti yang kamu yakini atau ketentuan lembaga tempatmu berzakat.</p>'
    + `<div class="cmp">${kartu('baznas', 'BAZNAS · bruto', b)}${kartu('netto', 'Bersih · emas 24K', n)}</div>`
    + `<a class="jumhur" href="/zakat-simpanan-emas">Mengikuti pendapat jumhur empat mazhab? Gaji yang tersimpan dizakati sebagai simpanan setelah setahun →</a></div>`;
}

const PESAN = {
  kosong: 'Isi penghasilanmu. Hasil langsung muncul di sini.',
  'di-bawah-nisab': 'Penghasilanmu belum mencapai nisab, jadi belum wajib zakat penghasilan. Kamu tetap bisa bersedekah atau berinfak.',
} as const;

export function renderHasil(s: StatePenghasilan, a: Acuan): { html: string; r: Hasil; ring: Ringkas } {
  const r = penghasilan(s, a);
  const ring = ringkas(r, s);
  let html = `<div class="r-head"><span class="pill ${ring.kelas}"><i></i>${ring.status}</span>`
    + `<div class="amount${r.wajib ? '' : ' zero'}">${ring.angka}</div><div class="per">${ring.per}</div>`;
  if (!r.wajib) html += `<p class="r-msg">${PESAN[r.alasan === 'kosong' ? 'kosong' : 'di-bawah-nisab']}</p>`;
  if (!ring.kosong) html += meter(r);
  html += '</div>';
  if (!ring.kosong) html += rincian(r, s.metode) + bandingkan(s, a);
  return { html, r, ring };
}

/** Teks untuk tombol "Salin rincian". */
export function teksSalin(s: StatePenghasilan, a: Acuan): string {
  const r = penghasilan(s, a);
  const metode = s.metode === 'netto' ? 'penghasilan bersih, nisab 85 g emas 24K' : 'BAZNAS (bruto, SK 15/2026)';
  return [
    `TakarZakat · Zakat penghasilan (${s.periode === 'bulan' ? 'per bulan' : 'per tahun'})`,
    `Metode: ${metode}`,
    ...r.rincian.map(([l, v]) => `${l}: ${typeof v === 'number' ? rupiah(v) : v}`),
    `Nisab: ${rupiah(r.nisab)}`,
    `Zakat: ${r.wajib ? rupiah(r.zakat) : 'belum wajib'}`,
    `Harga acuan: ${a.tanggal}`,
    'takarzakat.pages.dev',
  ].join('\n');
}
