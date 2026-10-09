import {
  isInTolerance,
  parseSeries,
  seriesStats,
  toleranceBounds,
} from './stats';

test('parseSeries accepte espaces, ; et virgule décimale', () => {
  expect(parseSeries('1 2;3,5 ;  4')).toEqual([1, 2, 3.5, 4]);
  expect(parseSeries('  ')).toEqual([]);
  expect(parseSeries('1 abc 2')).toEqual([1, 2]);
});

test('seriesStats', () => {
  expect(seriesStats([])).toBeNull();
  expect(seriesStats([2, 4, 9])).toEqual({count: 3, mean: 5, min: 2, max: 9});
});

test('tolérance', () => {
  const b = toleranceBounds(10, 0.5);
  expect(b.min).toBeCloseTo(9.5);
  expect(b.max).toBeCloseTo(10.5);
  expect(toleranceBounds(10, -0.5)).toEqual(b);
  expect(isInTolerance(10.5, b)).toBe(true);
  expect(isInTolerance(9.5, b)).toBe(true);
  expect(isInTolerance(10.6, b)).toBe(false);
  expect(isInTolerance(9.4, b)).toBe(false);
  // arrondi flottant : 10.1 - 0.1 ne doit pas exclure 10
  expect(isInTolerance(10, toleranceBounds(10.1, 0.1))).toBe(true);
});
