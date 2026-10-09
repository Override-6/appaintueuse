import {toDm2} from './surface';

describe('toDm2', () => {
  test('1 m² = 100 dm²', () => {
    expect(toDm2(2, 'm2')).toBe(200);
    expect(toDm2(0.5, 'm2')).toBe(50);
  });

  test('dm² tel quel', () => {
    expect(toDm2(12, 'dm2')).toBe(12);
  });

  test('1 dm² = 100 cm² : cm² ÷ 100', () => {
    expect(toDm2(250, 'cm2')).toBeCloseTo(2.5);
    expect(toDm2(100, 'cm2')).toBeCloseTo(1);
  });
});
