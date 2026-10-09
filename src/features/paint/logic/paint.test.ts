import {
  dryFromWet,
  litersNeeded,
  netArea,
  spreadingRate,
  splitMix,
  thinnerToAdd,
  wetFromDry,
} from './paint';

describe('paint', () => {
  test('rendement et litres', () => {
    expect(spreadingRate(50, 50)).toBe(10);
    expect(litersNeeded(100, 2, 10, 10)).toBeCloseTo(22);
  });

  test('épaisseurs', () => {
    expect(dryFromWet(100, 50)).toBe(50);
    expect(wetFromDry(50, 50)).toBe(100);
  });

  test('surface nette, mélange, dilution', () => {
    expect(netArea(100, [5, 2.5])).toBe(92.5);
    expect(splitMix([4, 1, 1], 6)).toEqual([4, 1, 1]);
    expect(thinnerToAdd(5, 10)).toBe(0.5);
  });
});
