import learning from '@/i18n/locales/fr/learning.json';
import {splitInParts} from './parts';

const hasKey = (key: string) =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      learning,
    ) !== undefined;

describe('splitInParts', () => {
  test('5-1-1 pour 6 L : 7 parts', () => {
    const {perPart, amounts, steps} = splitInParts([5, 1, 1], 6);
    expect(perPart).toBeCloseTo(6 / 7);
    expect(amounts).toHaveLength(3);
    expect(amounts[0]).toBeCloseTo(30 / 7);
    expect(amounts[1]).toBeCloseTo(6 / 7);
    expect(amounts.reduce((s, a) => s + a, 0)).toBeCloseTo(6);
    expect(steps.map(s => s.key)).toEqual([
      'learning.parts.sum',
      'learning.parts.perPart',
      'learning.parts.amount',
      'learning.parts.amount',
      'learning.parts.amount',
      'learning.parts.check',
    ]);
  });

  test('étapes numérotées par composant', () => {
    const {steps} = splitInParts([4, 1], 10);
    expect(steps[2].params).toEqual({n: 1, perPart: '2', part: '4', amount: '8'});
  });

  test('parts invalides : aucun montant', () => {
    expect(splitInParts([], 5)).toEqual({
      perPart: 0,
      amounts: [],
      steps: [{key: 'learning.parts.invalid'}],
    });
    expect(splitInParts([1, -1], 5).amounts).toEqual([]);
    expect(splitInParts([0, 0], 5).amounts).toEqual([]);
  });

  test('toutes les clés existent dans learning.json', () => {
    for (const s of splitInParts([2, 3], 9).steps) {
      expect(hasKey(s.key)).toBe(true);
    }
  });
});
