import learning from '@/i18n/locales/fr/learning.json';
import {chunksOf, solveCross} from './cross';
import type {Step} from './steps';

const hasKey = (key: string) =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      learning,
    ) !== undefined;

const keys = (steps: Step[]) => steps.map(s => s.key);

describe('solveCross', () => {
  test('produit en croix simple', () => {
    const {result, steps} = solveCross(2, 10, 6);
    expect(result).toBe(30);
    expect(keys(steps)).toEqual([
      'learning.cross.pair',
      'learning.cross.unit',
      'learning.cross.direct',
      'learning.cross.result',
    ]);
  });

  test('a = 1 : pas d\'étape « pour 1 »', () => {
    const {result, steps} = solveCross(1, 700, 350);
    expect(result).toBe(245000);
    expect(keys(steps)).not.toContain('learning.cross.unit');
  });

  test('grand nombre découpé en petites opérations', () => {
    const {result, steps} = solveCross(1, 700, 350);
    expect(keys(steps)).toEqual([
      'learning.cross.pair',
      'learning.cross.split',
      'learning.cross.part',
      'learning.cross.part',
      'learning.cross.sum',
      'learning.cross.result',
    ]);
    expect(result).toBeCloseTo(700 * 350);
  });

  test('a = 0 : pas de résultat', () => {
    const {result, steps} = solveCross(0, 5, 3);
    expect(result).toBeUndefined();
    expect(keys(steps)).toEqual(['learning.cross.pair', 'learning.cross.zero']);
  });

  test('fractions : pas de découpage', () => {
    expect(solveCross(4, 6, 1).result).toBe(1.5);
    expect(solveCross(3, 10, 2.5).result).toBeCloseTo(8.3333333);
  });

  test('toutes les clés existent dans learning.json', () => {
    for (const {steps} of [solveCross(0, 1, 1), solveCross(3, 7, 12500), solveCross(2, 3, 4)]) {
      for (const s of steps) {
        expect(hasKey(s.key)).toBe(true);
      }
    }
  });
});

describe('chunksOf', () => {
  test('découpe par puissances de 10', () => {
    expect(chunksOf(12500)).toEqual([10000, 2000, 500]);
    expect(chunksOf(350)).toEqual([300, 50]);
    expect(chunksOf(7)).toEqual([7]);
  });
});
