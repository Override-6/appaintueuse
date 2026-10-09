import {parseNumber} from '@/utils/format';

// Découpe une série saisie (séparée par des espaces ou des ';'). Ignore les jetons invalides.
export function parseSeries(text: string): number[] {
  return text
    .split(/[\s;]+/)
    .filter(s => s !== '')
    .map(s => parseNumber(s))
    .filter((n): n is number => n !== undefined);
}

export type SeriesStats = {count: number; mean: number; min: number; max: number};

// Nombre, moyenne, minimum et maximum d'une série (null si vide).
export function seriesStats(values: number[]): SeriesStats | null {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return {
    count: values.length,
    mean: sum / values.length,
    min: values.reduce((acc, v) => Math.min(acc, v)),
    max: values.reduce((acc, v) => Math.max(acc, v)),
  };
}

export type Bounds = {min: number; max: number};

// Bornes admises : nominale ± écart (l'écart est pris en valeur absolue).
export function toleranceBounds(nominal: number, plusMinus: number): Bounds {
  const e = Math.abs(plusMinus);
  return {min: nominal - e, max: nominal + e};
}

const EPS = 1e-9; // tolérance aux erreurs d'arrondi flottant

// Vrai si la mesure est comprise entre les bornes (bornes incluses).
export function isInTolerance(measured: number, bounds: Bounds): boolean {
  return measured >= bounds.min - EPS && measured <= bounds.max + EPS;
}
