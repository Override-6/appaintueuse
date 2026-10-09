import {
  convertVolume,
  formatLiters,
  formatMl,
  roundTo,
  sumOf,
  toLiters,
  validateMix,
} from './mix';

describe('conversions L ↔ mL', () => {
  test('toLiters ramène les mL en litres', () => {
    expect(toLiters(6, 'L')).toBe(6);
    expect(toLiters(500, 'mL')).toBe(0.5);
  });

  test('convertVolume change d’unité sans perdre la valeur', () => {
    expect(convertVolume(6, 'L', 'mL')).toBe(6000);
    expect(convertVolume(6000, 'mL', 'L')).toBe(6);
    expect(convertVolume(0.5, 'L', 'mL')).toBe(500);
    expect(convertVolume(2, 'L', 'L')).toBe(2);
  });
});

describe('validateMix', () => {
  test('saisie correcte : pas d’erreur', () => {
    expect(validateMix([5, 1, 1], 6)).toBeUndefined();
  });

  test('il faut au moins 2 composants', () => {
    expect(validateMix([3], 6)).toBe('tooFew');
    expect(validateMix([], 6)).toBe('tooFew');
  });

  test('chaque part est un entier au moins égal à 1', () => {
    expect(validateMix([2, 0], 6)).toBe('partsNotInteger');
    expect(validateMix([2, 1.5], 6)).toBe('partsNotInteger');
    expect(validateMix([2, -1], 6)).toBe('partsNotInteger');
  });

  test('le total doit être connu et positif', () => {
    expect(validateMix([1, 1], undefined)).toBe('missingTotal');
    expect(validateMix([1, 1], 0)).toBe('missingTotal');
    expect(validateMix([1, 1], -2)).toBe('missingTotal');
  });
});

describe('formatage', () => {
  test('litres avec 3 décimales au plus', () => {
    expect(formatLiters(30 / 7)).toBe('4,286');
    expect(formatLiters(0.5)).toBe('0,5');
  });

  test('mL avec 1 décimale et groupes de milliers', () => {
    expect(formatMl(30 / 7)).toBe('4 285,7');
    expect(formatMl(0.0042)).toBe('4,2');
  });

  test('roundTo et sumOf', () => {
    expect(roundTo(1.23456, 2)).toBe(1.23);
    expect(sumOf([1.5, 2.5])).toBe(4);
    expect(sumOf([])).toBe(0);
  });
});
