import paint from '@/i18n/locales/fr/paint.json';
import type {PlanPiece} from './plan';
import {parseCount, planResult, totalAreaDm2, totalSteps} from './plan';

const hasKey = (key: string) =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      paint,
    ) !== undefined;

const piece = (areaDm2: number, count = 1): PlanPiece => ({areaDm2, count});

describe('surface totale', () => {
  test('chaque pièce compte sa surface × son nombre d\'exemplaires', () => {
    expect(totalAreaDm2([piece(12, 2)])).toBe(24);
    expect(totalAreaDm2([piece(12, 2), piece(5, 1)])).toBe(29);
    expect(totalAreaDm2([piece(12, 1), piece(5, 4)])).toBe(32);
  });

  test('aucune pièce : total nul, pas d\'étapes', () => {
    expect(totalAreaDm2([])).toBe(0);
    expect(totalSteps([])).toEqual([]);
  });

  test('étapes : une pièce, somme avec multiplicateurs', () => {
    expect(totalSteps([piece(12)])[0].key).toBe('paint.guide.plan.one');
    expect(totalSteps([piece(12, 2)])[0].key).toBe('paint.guide.plan.sum');
    expect(totalSteps([piece(12, 2), piece(5)])[0].params).toEqual({
      values: '12 × 2 + 5',
      total: '29',
    });
  });

  test('toutes les clés d\'étapes existent', () => {
    const steps = [
      ...totalSteps([piece(12)]),
      ...totalSteps([piece(12, 3)]),
      ...totalSteps([piece(12), piece(5, 2)]),
    ];
    for (const s of steps) expect(hasKey(s.key)).toBe(true);
  });
});

describe('planResult', () => {
  test('litres = dm² ÷ rendement, avec marge et mL', () => {
    const r = planResult([piece(700)], 700, 10);
    expect(r).toBeDefined();
    expect(r!.total).toBe(700);
    expect(r!.liters).toBeCloseTo(1);
    expect(r!.ml).toBeCloseTo(1000);
    expect(r!.withMargin).toBeCloseTo(1.1);
    expect(r!.withMarginMl).toBeCloseTo(1100);
    expect(r!.cross.result).toBeCloseTo(1);
  });

  test('la marge ne change pas la quantité sans marge', () => {
    const r = planResult([piece(700)], 700, 0);
    expect(r!.liters).toBeCloseTo(1);
    expect(r!.withMargin).toBeCloseTo(1);
  });

  test('pas de résultat sans pièce, ou avec un rendement nul', () => {
    expect(planResult([], 700, 5)).toBeUndefined();
    expect(planResult([piece(10)], 0, 5)).toBeUndefined();
    expect(planResult([piece(10)], 700, -1)).toBeUndefined();
  });

  test('le nombre d\'exemplaires entre dans la quantité', () => {
    const r = planResult([piece(350, 2)], 700, 0);
    expect(r!.total).toBe(700);
    expect(r!.liters).toBeCloseTo(1);
  });
});

describe('parseCount', () => {
  test('entier au moins égal à 1', () => {
    expect(parseCount('1')).toBe(1);
    expect(parseCount(' 3 ')).toBe(3);
    expect(parseCount('2,0')).toBe(2);
  });

  test('refuse vide, zéro, décimal, négatif ou texte', () => {
    expect(parseCount('')).toBeUndefined();
    expect(parseCount('0')).toBeUndefined();
    expect(parseCount('1,5')).toBeUndefined();
    expect(parseCount('-2')).toBeUndefined();
    expect(parseCount('abc')).toBeUndefined();
  });
});
