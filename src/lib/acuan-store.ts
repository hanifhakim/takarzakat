/**
 * Harga acuan di browser. Urutan prioritas:
 *   1. ubahan manual pengguna (localStorage, tidak pernah dikirim)
 *   2. harga emas/perak dunia dari /api/harga (cache 30 menit di sessionStorage)
 *   3. angka bawaan src/data/acuan.json
 */
import { ACUAN, type Acuan } from './zakat';
import { hargaValid, type HargaLive } from './harga';

export const KUNCI = 'takar.acuan';
export const KUNCI_LIVE = 'takar.harga';
export const LIVE_MAKS_MS = 30 * 60 * 1000;
export const BISA_DIUBAH = ['emas24', 'perak', 'berasKg', 'gabahKg'] as const;
export type KunciUbah = (typeof BISA_DIUBAH)[number];
export type Ubahan = Partial<Record<KunciUbah, number>>;

export type SumberHarga = 'manual' | 'live' | 'bawaan';
export type AcuanAktif = Acuan & { diubah: boolean; sumberHarga: SumberHarga; waktuHarga?: string };

/** Gabungkan bawaan ← live ← ubahan pengguna; abaikan nilai tidak valid. */
export function gabung(ubahan: unknown, bawaan: Acuan = ACUAN, live?: HargaLive | null): AcuanAktif {
  const a: AcuanAktif = { ...bawaan, diubah: false, sumberHarga: 'bawaan' };
  if (live && hargaValid(live)) {
    a.emas24 = live.emas24;
    a.perak = live.perak;
    a.sumberHarga = 'live';
    a.waktuHarga = live.waktuHarga;
  }
  if (ubahan && typeof ubahan === 'object') {
    for (const k of BISA_DIUBAH) {
      const v = Number((ubahan as Record<string, unknown>)[k]);
      if (Number.isFinite(v) && v > 0 && v < 1e9 && v !== a[k]) {
        a[k] = v;
        a.diubah = true;
        if (k === 'emas24' || k === 'perak') a.sumberHarga = 'manual';
      }
    }
  }
  return a;
}

/** Label singkat sumber harga untuk UI. */
export function labelHarga(a: AcuanAktif, sekarang = Date.now()): string {
  if (a.sumberHarga === 'manual') return 'diubah manual';
  if (a.sumberHarga === 'live' && a.waktuHarga) {
    const menit = Math.max(0, Math.round((sekarang - Date.parse(a.waktuHarga)) / 60000));
    const kapan = menit < 1 ? 'baru saja' : menit < 60 ? `${menit} menit lalu` : `${Math.round(menit / 60)} jam lalu`;
    return `harga emas dunia · ${kapan}`;
  }
  const tgl = new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  return `bawaan ${tgl}`;
}

function bacaLive(): HargaLive | null {
  try {
    const o = JSON.parse(sessionStorage.getItem(KUNCI_LIVE) || 'null');
    return o && hargaValid(o.data) && Date.now() - o.t < LIVE_MAKS_MS ? o.data : null;
  } catch {
    return null;
  }
}

export function muat(): AcuanAktif {
  let ubahan: unknown = null;
  try { ubahan = JSON.parse(localStorage.getItem(KUNCI) || 'null'); } catch { /* abaikan */ }
  return gabung(ubahan, ACUAN, bacaLive());
}

let sedang: Promise<void> | null = null;
/** Ambil harga live sekali per 30 menit; memicu 'takar:acuan' bila berhasil. Gagal = diam (pakai bawaan). */
export function segarkanHarga(): Promise<void> {
  if (bacaLive()) return Promise.resolve();
  sedang ??= fetch('/api/harga', { headers: { accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (!hargaValid(j)) return;
      try { sessionStorage.setItem(KUNCI_LIVE, JSON.stringify({ t: Date.now(), data: j })); } catch { /* abaikan */ }
      window.dispatchEvent(new CustomEvent('takar:acuan'));
    })
    .catch(() => { /* offline / API gagal: tetap pakai bawaan */ })
    .finally(() => { sedang = null; });
  return sedang;
}

export function simpan(ubahan: Ubahan): void {
  try {
    const dasar = gabung(null, ACUAN, bacaLive());
    const bersih: Ubahan = {};
    for (const k of BISA_DIUBAH) if (ubahan[k] && ubahan[k] !== dasar[k]) bersih[k] = ubahan[k];
    if (Object.keys(bersih).length) localStorage.setItem(KUNCI, JSON.stringify(bersih));
    else localStorage.removeItem(KUNCI);
  } catch { /* mode privat: abaikan */ }
  window.dispatchEvent(new CustomEvent('takar:acuan'));
}

export function reset(): void {
  try { localStorage.removeItem(KUNCI); } catch { /* abaikan */ }
  window.dispatchEvent(new CustomEvent('takar:acuan'));
}
