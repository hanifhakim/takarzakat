/** Harga acuan yang bisa diubah pengguna (disimpan di localStorage perangkat, tidak pernah dikirim). */
import { ACUAN, type Acuan } from './zakat';

export const KUNCI = 'takar.acuan';
export const BISA_DIUBAH = ['emas24', 'perak', 'berasKg', 'gabahKg'] as const;
export type KunciUbah = (typeof BISA_DIUBAH)[number];
export type Ubahan = Partial<Record<KunciUbah, number>>;

/** Gabungkan ubahan pengguna dengan bawaan; abaikan nilai tidak valid. */
export function gabung(ubahan: unknown, bawaan: Acuan = ACUAN): Acuan & { diubah: boolean } {
  const a: Acuan & { diubah: boolean } = { ...bawaan, diubah: false };
  if (ubahan && typeof ubahan === 'object') {
    for (const k of BISA_DIUBAH) {
      const v = Number((ubahan as Record<string, unknown>)[k]);
      if (Number.isFinite(v) && v > 0 && v < 1e9 && v !== bawaan[k]) {
        a[k] = v;
        a.diubah = true;
      }
    }
  }
  return a;
}

export function muat(): Acuan & { diubah: boolean } {
  try {
    return gabung(JSON.parse(localStorage.getItem(KUNCI) || 'null'));
  } catch {
    return gabung(null);
  }
}

export function simpan(ubahan: Ubahan): void {
  try {
    const bersih: Ubahan = {};
    for (const k of BISA_DIUBAH) if (ubahan[k] && ubahan[k] !== ACUAN[k]) bersih[k] = ubahan[k];
    if (Object.keys(bersih).length) localStorage.setItem(KUNCI, JSON.stringify(bersih));
    else localStorage.removeItem(KUNCI);
  } catch {
    /* mode privat: abaikan */
  }
  window.dispatchEvent(new CustomEvent('takar:acuan'));
}

export function reset(): void {
  try { localStorage.removeItem(KUNCI); } catch { /* abaikan */ }
  window.dispatchEvent(new CustomEvent('takar:acuan'));
}
