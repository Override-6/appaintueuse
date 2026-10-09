import {CATEGORIES, convert} from './conversions';

const cat = (id: string) => CATEGORIES.find(c => c.id === id)!;

describe('convert', () => {
  test('longueur', () => {
    expect(convert(cat('length'), 'm', 'mm', 1)).toBeCloseTo(1000);
    expect(convert(cat('length'), 'km', 'm', 1)).toBeCloseTo(1000);
  });

  test('température', () => {
    expect(convert(cat('temperature'), 'K', 'C', 0)).toBeCloseTo(-273.15);
  });

  test('pression', () => {
    expect(convert(cat('pressure'), 'bar', 'kPa', 1)).toBeCloseTo(100);
  });

  test('préfixes métriques', () => {
    expect(convert(cat('length'), 'dam', 'dm', 1)).toBeCloseTo(100);
    expect(convert(cat('length'), 'hm', 'm', 1)).toBeCloseTo(100);
    expect(convert(cat('area'), 'dam2', 'm2', 1)).toBeCloseTo(100);
    expect(convert(cat('area'), 'hm2', 'ha', 1)).toBeCloseTo(1);
    expect(convert(cat('volume'), 'dm3', 'L', 1)).toBeCloseTo(1);
    expect(convert(cat('volume'), 'hL', 'daL', 1)).toBeCloseTo(10);
    expect(convert(cat('mass'), 'hg', 'g', 1)).toBeCloseTo(100);
  });
});
