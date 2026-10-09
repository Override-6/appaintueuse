import {formatNumber as f} from '@/utils/format';
import type {Step} from './steps';

export type CrossResult = {result: number | undefined; steps: Step[]};

// Découpe un entier ≥ 1 en morceaux « un chiffre × puissance de 10 » : 12500 → [10000, 2000, 500]
export function chunksOf(n: number): number[] {
  const chunks: number[] = [];
  let rest = n;
  while (rest > 0) {
    let p = 1;
    while (p * 10 <= rest) p *= 10;
    const chunk = Math.floor(rest / p) * p;
    chunks.push(chunk);
    rest -= chunk;
  }
  return chunks;
}

// Produit en croix : a ↔ b, c ↔ ?  →  ? = b × c ÷ a
// Méthode « pour 1 » : on trouve la valeur de 1, puis on multiplie par c (grands nombres découpés).
export function solveCross(a: number, b: number, c: number): CrossResult {
  const steps: Step[] = [{key: 'learning.cross.pair', params: {a: f(a), b: f(b)}}];
  if (a === 0) {
    steps.push({key: 'learning.cross.zero'});
    return {result: undefined, steps};
  }

  const unit = b / a;
  const result = (b * c) / a;
  if (a !== 1) {
    steps.push({key: 'learning.cross.unit', params: {a: f(a), b: f(b), unit: f(unit)}});
  }

  if (Number.isInteger(c) && c >= 10 && chunksOf(c).length > 1) {
    const chunks = chunksOf(c);
    const values = chunks.map(chunk => unit * chunk);
    steps.push({
      key: 'learning.cross.split',
      params: {c: f(c), chunks: chunks.map(n => f(n)).join(' + ')},
    });
    chunks.forEach((chunk, i) =>
      steps.push({
        key: 'learning.cross.part',
        params: {unit: f(unit), part: f(chunk), value: f(values[i])},
      }),
    );
    steps.push({
      key: 'learning.cross.sum',
      params: {values: values.map(n => f(n)).join(' + '), result: f(result)},
    });
  } else if (c !== 1) {
    steps.push({
      key: 'learning.cross.direct',
      params: {unit: f(unit), c: f(c), result: f(result)},
    });
  }

  steps.push({key: 'learning.cross.result', params: {result: f(result)}});
  return {result, steps};
}
