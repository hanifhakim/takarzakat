/**
 * Perekat DOM untuk semua halaman kalkulator. Konvensi markup:
 *   input[data-k][data-mode=int|dec]   angka → st[k]
 *   input[type=checkbox][data-k]       boolean → st[k]
 *   select[data-k]                     angka → st[k]
 *   button[data-seg=k][data-v][data-t] pilihan → st[k] (data-t: str | bool ('ya'/'belum') | num)
 *   button[data-chip]                  centang → st.punya[]
 *   button[data-step][data-step-k]     +/- angka bulat (1..50)
 *   output[data-out=k]                 menampilkan st[k]
 *   [data-show="k:v"]                  tampil bila String(st[k]) === v
 *   [data-has=x]                       tampil bila st.punya berisi x
 *   [data-set="k:v"] (di kartu hasil)  set st[k] = v (tipe mengikuti nilai awal)
 * Query string (?gaji=10000000) hanya dibaca untuk isian awal, tidak pernah ditulis.
 */
import { formatDenganKursor, formatTampil, nilaiDari } from './input';
import { labelHarga, muat, segarkanHarga, type AcuanAktif } from './acuan-store';
import type { HasilView } from './view/umum';

type Nilai = number | string | boolean | string[];
type State = Record<string, Nilai>;

export interface Opsi<S> {
  awal: S;
  render: (s: S, a: AcuanAktif) => HasilView;
  salin: (s: S, a: AcuanAktif) => string;
  /** Dipanggil setelah kontrol disinkronkan (mis. label "per bulan"). */
  setelah?: (s: S, form: HTMLElement) => void;
}

const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];

function ubahTipe(contoh: Nilai, v: string): Nilai {
  if (typeof contoh === 'number') return nilaiDari(formatTampil(v.replace('.', ','), 'dec'));
  if (typeof contoh === 'boolean') return v === 'true' || v === '1' || v === 'ya';
  if (Array.isArray(contoh)) return v.split(',').filter(Boolean);
  return v;
}

export function pasang<S extends object>(o: Opsi<S>): void {
  const st = structuredClone(o.awal) as unknown as State;
  const awal = o.awal as unknown as State;
  const form = $('#form')!;
  const isi = $('#hasil-isi')!;
  const hasil = $('#hasil')!;
  const dock = $('#dock')!;
  let acuan = muat();

  const q = new URLSearchParams(location.search);
  for (const k of Object.keys(awal)) {
    const v = q.get(k);
    if (v === null) continue;
    const x = ubahTipe(awal[k], v);
    if (typeof x === 'number' && x < 0) continue;
    if (typeof awal[k] === 'string' && !$(`[data-seg="${k}"][data-v="${CSS.escape(v)}"]`, form)) continue; // hanya nilai yang ada pilihannya
    st[k] = x;
  }

  const segNilai = (k: string) => {
    const v = st[k];
    return typeof v === 'boolean' ? (v ? 'ya' : 'belum') : String(v);
  };

  function sinkron() {
    $$<HTMLButtonElement>('[data-seg]', form).forEach((b) => b.setAttribute('aria-pressed', String(segNilai(b.dataset.seg!) === b.dataset.v)));
    const punya = (st.punya as string[] | undefined) ?? [];
    $$<HTMLButtonElement>('[data-chip]', form).forEach((b) => b.setAttribute('aria-pressed', String(punya.includes(b.dataset.chip!))));
    $$('[data-has]', form).forEach((d) => { d.hidden = !punya.includes(d.dataset.has!); });
    $$('[data-show]', form).forEach((d) => {
      const [k, v] = d.dataset.show!.split(':');
      d.hidden = String(st[k]) !== v;
    });
    $$('[data-out]', form).forEach((d) => { d.textContent = String(st[d.dataset.out!]); });
    o.setelah?.(st as unknown as S, form);
  }

  let dockAktif = false;
  let hasilTerlihat = false;
  const aturDock = () => dock.classList.toggle('hide', !dockAktif || hasilTerlihat);

  function perbarui() {
    sinkron();
    const { html, ring } = o.render(st as unknown as S, acuan);
    isi.innerHTML = html;
    $('#dockAmt')!.textContent = ring.angka;
    $('#dockLbl')!.textContent = `${ring.status} · ${ring.per}`;
    dockAktif = !ring.kosong;
    aturDock();
  }

  // Input angka.
  $$<HTMLInputElement>('input[data-k]:not([type=checkbox])', form).forEach((el) => {
    const k = el.dataset.k!;
    const mode = el.dataset.mode === 'dec' ? 'dec' : 'int';
    if (st[k]) el.value = formatTampil(String(st[k]).replace('.', ','), mode);
    el.addEventListener('input', () => {
      const { value, kursor } = formatDenganKursor(el.value, el.selectionStart ?? el.value.length, mode);
      el.value = value;
      if (document.activeElement === el) el.setSelectionRange(kursor, kursor);
      st[k] = nilaiDari(value);
      perbarui();
    });
  });
  $$<HTMLInputElement>('input[type=checkbox][data-k]', form).forEach((el) => {
    el.checked = Boolean(st[el.dataset.k!]);
    el.addEventListener('change', () => { st[el.dataset.k!] = el.checked; perbarui(); });
  });
  $$<HTMLSelectElement>('select[data-k]', form).forEach((el) => {
    el.value = String(st[el.dataset.k!]);
    el.addEventListener('change', () => { st[el.dataset.k!] = Number(el.value); perbarui(); });
  });

  form.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const seg = t.closest<HTMLButtonElement>('[data-seg]');
    if (seg) {
      const k = seg.dataset.seg!, v = seg.dataset.v!, tipe = seg.dataset.t;
      st[k] = tipe === 'bool' ? v === 'ya' : tipe === 'num' ? Number(v) : v;
      return perbarui();
    }
    const chip = t.closest<HTMLButtonElement>('[data-chip]');
    if (chip) {
      const punya = new Set(st.punya as string[]);
      punya.has(chip.dataset.chip!) ? punya.delete(chip.dataset.chip!) : punya.add(chip.dataset.chip!);
      st.punya = [...punya];
      return perbarui();
    }
    const step = t.closest<HTMLButtonElement>('[data-step]');
    if (step) {
      const k = step.dataset.stepK!;
      st[k] = Math.max(1, Math.min(50, Number(st[k]) + Number(step.dataset.step)));
      return perbarui();
    }
  });

  isi.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-set]');
    if (!b) return;
    const [k, v] = b.dataset.set!.split(':');
    if (k in st) { st[k] = ubahTipe(awal[k], v); perbarui(); }
  });

  const tgl = $('#acuanTgl');
  const label = () => { if (tgl) tgl.textContent = labelHarga(acuan); };
  window.addEventListener('takar:acuan', () => { acuan = muat(); label(); perbarui(); });
  label();
  segarkanHarga();

  const toast = (m: string) => {
    const t = $('#toast')!;
    t.textContent = m; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1800);
  };
  $('#copyBtn')!.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(o.salin(st as unknown as S, acuan)); toast('Rincian disalin'); }
    catch { toast('Tidak bisa menyalin di peramban ini'); }
  });

  new IntersectionObserver(([en]) => { hasilTerlihat = en.isIntersecting; aturDock(); }, { threshold: 0.15 }).observe(hasil);
  $('#dockBtn')!.addEventListener('click', () => {
    hasil.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    hasil.focus({ preventScroll: true });
  });

  perbarui();
}
