import { show, toInput } from './format';

describe('toInput', () => {
  test('virgule décimale, sans zéros inutiles', () => {
    expect(toInput(1.5)).toBe('1,5');
    expect(toInput(2)).toBe('2');
    expect(toInput(10)).toBe('10');
  });

  test('pas de notation scientifique', () => {
    expect(toInput(0.0000001)).toBe('0,0000001');
  });
});

describe('show', () => {
  test('affichage décimal en français', () => {
    expect(show(1.5, false)).toBe('1,5');
  });

  test('fraction exacte sans préfixe', () => {
    expect(show(0.5, true)).toBe('1/2');
    expect(show(0.375, true)).toBe('3/8');
  });

  test('fraction approchée préfixée par ≈', () => {
    expect(show(Math.SQRT2, true).startsWith('≈ ')).toBe(true);
  });
});
