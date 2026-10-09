import {formatNumber as f} from '@/utils/format';
import type {Step} from './steps';

export type PartsResult = {perPart: number; amounts: number[]; steps: Step[]};

// Répartition en parts : ex. parts 5-1-1 et total 6 → 7 parts, 6 ÷ 7 par part.
// Si les parts sont invalides (négatives ou somme nulle) : perPart 0, aucun montant.
export function splitInParts(parts: number[], total: number): PartsResult {
  const sum = parts.reduce((s, p) => s + p, 0);
  if (parts.length === 0 || parts.some(p => p < 0) || sum <= 0) {
    return {perPart: 0, amounts: [], steps: [{key: 'learning.parts.invalid'}]};
  }

  const perPart = total / sum;
  const amounts = parts.map(p => p * perPart);
  const steps: Step[] = [
    {key: 'learning.parts.sum', params: {expr: parts.map(n => f(n)).join(' + '), sum: f(sum)}},
    {
      key: 'learning.parts.perPart',
      params: {total: f(total), sum: f(sum), perPart: f(perPart)},
    },
    ...parts.map((p, i) => ({
      key: 'learning.parts.amount',
      params: {n: i + 1, perPart: f(perPart), part: f(p), amount: f(amounts[i])},
    })),
  ];

  const back = amounts.reduce((s, a) => s + a, 0);
  steps.push({
    key: 'learning.parts.check',
    params: {expr: amounts.map(n => f(n)).join(' + '), sum: f(back)},
  });
  return {perPart, amounts, steps};
}
