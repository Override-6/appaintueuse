import type {Unit} from './surfaces';

// Unités proposées pour les dimensions des formes et de l'échelle
export const LENGTH_UNITS: Unit[] = ['mm', 'cm', 'dm', 'm'];

const AREA_OUTPUTS = ['area', 'surface', 'lateralArea'];
const VOLUME_OUTPUTS = ['volume'];

// Unité affichée avec un résultat : ² pour une aire, ³ pour un volume
export function outputSuffix(output: string, unit: string): string {
  if (AREA_OUTPUTS.includes(output)) return `${unit}²`;
  if (VOLUME_OUTPUTS.includes(output)) return `${unit}³`;
  return unit;
}
