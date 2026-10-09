import { formatNumber } from '@/utils/format';
import { fromFraction, toFraction } from './calc';

// Nombre -> texte saisissable (virgule, sans notation scientifique)
export const toInput = (v: number): string =>
  Number(v.toPrecision(12))
    .toFixed(12)
    .replace(/\.?0+$/, '')
    .replace('.', ',');

// Affichage du résultat, en décimal (formatNumber) ou en fraction
export const show = (v: number, asFraction: boolean): string => {
  if (!asFraction) {
    return formatNumber(v);
  }
  const f = toFraction(v);
  const exact = Math.abs((fromFraction(f) ?? NaN) - v) < 1e-9;
  return exact ? f : `≈ ${f}`;
};
