import {formatNumber} from '@/utils/format';

export type VolumeUnit = 'L' | 'mL';
export type MixError = 'tooFew' | 'partsNotInteger' | 'missingTotal';

export const MIN_PARTS = 2;
export const MAX_PARTS = 6;
export const MAX_PART_VALUE = 99;
export const DEFAULT_PARTS = [5, 1, 1];
export const DEFAULT_TOTAL_L = 6;

// Arrondi à un nombre donné de décimales (évite le bruit de virgule flottante)
export const roundTo = (n: number, decimals: number): number => {
  const k = 10 ** decimals;
  return Math.round(n * k) / k;
};

// Valeur saisie en litres, quelle que soit l'unité choisie
export const toLiters = (value: number, unit: VolumeUnit): number =>
  unit === 'L' ? value : value / 1000;

// Conversion L ↔ mL : 6 L = 6 000 mL
export const convertVolume = (value: number, from: VolumeUnit, to: VolumeUnit): number => {
  const liters = toLiters(value, from);
  return roundTo(to === 'L' ? liters : liters * 1000, 6);
};

// Affichage en litres : 3 décimales au plus
export const formatLiters = (liters: number): string => formatNumber(roundTo(liters, 3));

// Affichage en mL : 1 décimale au plus (1 mL près suffit à peindre)
export const formatMl = (liters: number): string => formatNumber(roundTo(liters * 1000, 1));

// Première erreur bloquante, ou undefined si la saisie est utilisable
export function validateMix(parts: number[], totalL: number | undefined): MixError | undefined {
  if (parts.length < MIN_PARTS) {
    return 'tooFew';
  }
  if (parts.some(p => !Number.isInteger(p) || p < 1)) {
    return 'partsNotInteger';
  }
  if (totalL === undefined || !(totalL > 0)) {
    return 'missingTotal';
  }
  return undefined;
}

// Somme des quantités (même unité que les entrées)
export const sumOf = (values: number[]): number => values.reduce((s, v) => s + v, 0);
