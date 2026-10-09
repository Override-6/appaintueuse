import {parseNumber} from '@/utils/format';

export type ScaleState = {
  real: string;
  plan: string;
  ratio: string;
  // Dernier champ rempli : il pilote le calcul
  last: 'real' | 'plan';
};

// Valeur dérivée (réelle = plan × échelle, ou plan = réelle ÷ échelle) et signalement d'un négatif
export function scaleResult({real, plan, ratio, last}: ScaleState): {
  derived?: number;
  negative: boolean;
} {
  const r = parseNumber(real);
  const p = parseNumber(plan);
  const k = parseNumber(ratio);

  // Dimensions et échelle négatives : pas de résultat
  const negative = [r, p, k].some(v => v !== undefined && v < 0);

  let derived: number | undefined;
  if (!negative && k !== undefined && k !== 0) {
    if (last === 'real' && r !== undefined) derived = r / k;
    if (last === 'plan' && p !== undefined) derived = p * k;
  }
  return {derived, negative};
}
