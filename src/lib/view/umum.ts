/** Potongan HTML bersama untuk kartu hasil semua kalkulator. Murni → bisa diuji. */
import { rupiah, type Rincian } from '../zakat';

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const pct = (k: number) => String(+(k * 100).toFixed(2)).replace('.', ',') + '%';

/** 1234.5 → "1.234,5" */
export const angka = (x: number, maks = 2) =>
  x.toLocaleString('id-ID', { maximumFractionDigits: maks });

export interface Ringkas { status: string; kelas: '' | 'yes' | 'wait'; angka: string; per: string; kosong: boolean }
export interface HasilView { html: string; ring: Ringkas }

export function kepala(ring: Ringkas, o: { wajib: boolean; pesan?: string; tambahan?: string; setara?: string }): string {
  return `<div class="r-head"><span class="pill ${ring.kelas}"><i></i>${esc(ring.status)}</span>`
    + `<div class="amount${o.wajib ? '' : ' zero'}">${esc(ring.angka)}</div>`
    + `<div class="per">${esc(ring.per)}${o.setara ? ` · setara ${esc(o.setara)}` : ''}</div>`
    + (o.pesan ? `<p class="r-msg">${o.pesan}</p>` : '')
    + (o.tambahan ?? '')
    + '</div>';
}

/** Meter dasar vs nisab. `fmt` untuk satuan (rupiah atau kg). */
export function meter(dasar: number, nisab: number, o: { fmt?: (x: number) => string; label?: string } = {}): string {
  if (!nisab) return '';
  const fmt = o.fmt ?? rupiah;
  const max = Math.max(dasar, nisab) * 1.15;
  const w = Math.min(100, (dasar / max) * 100);
  const m = (nisab / max) * 100;
  return `<div class="meter" aria-hidden="true"><div class="track"><div class="fill${dasar >= nisab ? '' : ' below'}" style="width:${w.toFixed(2)}%"></div><div class="mark" style="left:${m.toFixed(2)}%"></div></div>`
    + `<div class="legend2"><span>${esc(o.label ?? 'Dihitung')} ${esc(fmt(dasar))}</span><span><b>│</b> Nisab ${esc(fmt(nisab))}</span></div></div>`;
}

/** Tabel rincian + baris nisab + rumus. Baris terakhir rincian ditebalkan bila > 1 baris. */
export function tabel(rincian: Rincian[], o: { nisab?: [string, string]; rumus?: string; tebalAkhir?: boolean } = {}): string {
  const tebal = o.tebalAkhir ?? rincian.length > 1;
  const rows = rincian.map(([l, v], i) =>
    `<tr${tebal && i === rincian.length - 1 ? ' class="total"' : ''}><td>${esc(l)}</td><td>${typeof v === 'number' ? rupiah(v) : esc(v)}</td></tr>`).join('');
  const nis = o.nisab ? `<tr><td>${esc(o.nisab[0])}</td><td>${esc(o.nisab[1])}</td></tr>` : '';
  return `<div class="r-body"><table class="rows"><caption class="sr-only">Rincian perhitungan</caption><tbody>${rows}${nis}</tbody></table>`
    + (o.rumus ? `<p class="formula">${esc(o.rumus)}</p>` : '') + '</div>';
}

/** Kartu pilihan dua sisi (mis. metode BAZNAS vs bersih, nisab emas vs perak). */
export function pilihan(o: {
  judul: string; teks: string; kunci: string; aktif: string;
  kartu: { v: string; t: string; nilai: string; sub: string }[]; tautan?: string;
}): string {
  return `<div class="compare"><h3>${esc(o.judul)}</h3><p>${o.teks}</p><div class="cmp">`
    + o.kartu.map((k) => `<button type="button" data-set="${esc(o.kunci)}:${esc(k.v)}" aria-pressed="${o.aktif === k.v}">`
      + `<span class="t">${esc(k.t)}</span><span class="v">${esc(k.nilai)}</span><span class="s">${esc(k.sub)}</span></button>`).join('')
    + `</div>${o.tautan ?? ''}</div>`;
}

export const PESAN_UMUM = {
  bawahNisab: 'Belum mencapai nisab, jadi belum wajib zakat. Kamu tetap bisa bersedekah atau berinfak.',
  belumHaul: 'Sudah mencapai nisab, tapi belum genap satu tahun hijriah. Zakat jatuh tempo saat haul tercapai.',
} as const;
