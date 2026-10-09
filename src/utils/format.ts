const THIN_NBSP = ' '; // espace fine insécable : séparateur des milliers

// Analyse un nombre saisi (virgule ou point, espaces de milliers tolérés). Renvoie undefined si vide/invalide.
export function parseNumber(text: string): number | undefined {
  const s = text.trim().replace(/[\s ]/g, '').replace(',', '.');
  if (s === '') return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

// Écriture décimale sans notation scientifique (1e-7 → 0.0000001, 1.5e21 → 1500…)
function toPlain(r: number): string {
  if (Math.abs(r) >= 1e21) return BigInt(r).toString();
  const s = String(r);
  if (!/e/i.test(s)) return s;
  const decimals = Math.min(20, Math.max(0, 7 - Math.floor(Math.log10(Math.abs(r)))));
  return r.toFixed(decimals).replace(/\.?0+$/, '');
}

// Affiche avec décimale à la française, 8 chiffres significatifs au plus.
// Milliers groupés par espace fine insécable : 12 500.
export function formatNumber(n: number, decimalSeparator = ','): string {
  if (!Number.isFinite(n)) return '?';
  const plain = toPlain(Number(n.toPrecision(8)));
  const [intPart, decPart] = plain.split('.');
  const sign = intPart.startsWith('-') ? '-' : '';
  const digits = intPart.slice(sign.length).replace(/\B(?=(\d{3})+(?!\d))/g, THIN_NBSP);
  return sign + digits + (decPart !== undefined ? decimalSeparator + decPart : '');
}
