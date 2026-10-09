import {formatNumber, parseNumber} from './format';

const NNBSP = ' ';

describe('parseNumber', () => {
  test('virgule ou point', () => {
    expect(parseNumber('1,5')).toBe(1.5);
    expect(parseNumber('1.5')).toBe(1.5);
  });

  test('espaces de milliers (normaux ou insécables)', () => {
    expect(parseNumber('12 500')).toBe(12500);
    expect(parseNumber(`12${NNBSP}500,5`)).toBe(12500.5);
  });

  test('saisie invalide ou vide', () => {
    expect(parseNumber('abc')).toBeUndefined();
    expect(parseNumber('')).toBeUndefined();
  });
});

describe('formatNumber', () => {
  test('séparateur décimal français', () => {
    expect(formatNumber(1.5)).toBe('1,5');
  });

  test('pas de notation scientifique', () => {
    expect(formatNumber(1e-7)).toBe('0,0000001');
    expect(formatNumber(1.5e21)).not.toMatch(/e/i);
  });

  test('milliers groupés par espace fine insécable', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1000)).toBe(`1${NNBSP}000`);
    expect(formatNumber(12500)).toBe(`12${NNBSP}500`);
    expect(formatNumber(-12500)).toBe(`-12${NNBSP}500`);
    expect(formatNumber(1234567.5)).toBe(`1${NNBSP}234${NNBSP}567,5`);
  });

  test('aller-retour avec parseNumber', () => {
    expect(parseNumber(formatNumber(245000))).toBe(245000);
  });
});
