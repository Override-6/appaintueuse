import {formatNumber as f} from '@/utils/format';
import type {Step} from './steps';

const TOLERANCE = 0.05; // écart relatif accepté pour « environ »

// Repères en litres, du plus petit au plus grand (clés de traduction)
const PALIERS: {value: number; id: string}[] = [
  {value: 0.125, id: 'eighth'},
  {value: 0.25, id: 'quarter'},
  {value: 0.5, id: 'half'},
  {value: 0.75, id: 'threeQuarters'},
  {value: 1, id: 'one'},
];

// Plus d'un litre : pots de 1 litre, « environ 3 pots » ou « entre 2 et 3 pots »
function describePots(liters: number): Step {
  const n = Math.round(liters);
  if (Math.abs(liters - n) <= TOLERANCE * n) {
    return n === 1
      ? {key: 'learning.quantity.pot'}
      : {key: 'learning.quantity.pots', params: {n: f(n)}};
  }
  const low = Math.floor(liters);
  return {key: 'learning.quantity.potsBetween', params: {low: f(low), high: f(low + 1)}};
}

// Phrase de plausibilité en mots pour une quantité en litres
export function describeQuantity(liters: number): Step {
  if (!Number.isFinite(liters) || liters <= 0) {
    return {key: 'learning.quantity.zero'};
  }
  if (liters >= 1) {
    return describePots(liters);
  }
  if (liters < PALIERS[0].value) {
    return {key: 'learning.quantity.tiny'};
  }
  const near = PALIERS.find(p => Math.abs(liters - p.value) <= TOLERANCE * p.value);
  if (near) {
    return {key: `learning.quantity.about.${near.id}`};
  }
  // Entre deux repères : on nomme le repère inférieur
  const lower = PALIERS.filter(p => p.value < liters).pop();
  return {key: `learning.quantity.between.${lower?.id ?? 'eighth'}`};
}
