import paint from '@/i18n/locales/fr/paint.json';
import {coverageDm2PerLiter, rateSteps} from './rate';

const hasKey = (key: string) =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      paint,
    ) !== undefined;

describe('coverageDm2PerLiter', () => {
  test('1 L couvre 7 m² = 700 dm²', () => {
    expect(coverageDm2PerLiter(7, 'm2')).toBe(700);
  });

  test('dm² tel quel', () => {
    expect(coverageDm2PerLiter(350, 'dm2')).toBe(350);
  });

  test('500 mL couvrent 2 m² : 400 dm² par litre', () => {
    expect(coverageDm2PerLiter(2, 'm2', 500)).toBe(400);
  });

  test('250 mL couvrent 50 dm² : 200 dm² par litre', () => {
    expect(coverageDm2PerLiter(50, 'dm2', 250)).toBe(200);
  });
});

describe('rateSteps', () => {
  test('pas d\'étape pour un rendement déjà en dm²', () => {
    expect(rateSteps(350, 'dm2')).toEqual([]);
  });

  test('toutes les clés existent dans paint.json', () => {
    const steps = [...rateSteps(2, 'm2', 500), ...rateSteps(7, 'm2')];
    expect(steps).toHaveLength(3);
    for (const s of steps) expect(hasKey(s.key)).toBe(true);
  });
});
