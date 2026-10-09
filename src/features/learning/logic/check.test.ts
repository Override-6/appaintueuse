import {compareGuess, isClose} from './check';

describe('isClose', () => {
  test('écart de 2 % au plus', () => {
    expect(isClose(102, 100)).toBe(true);
    expect(isClose(103, 100)).toBe(false);
  });

  test('tolérance absolue de 0,01 pour les petites valeurs', () => {
    expect(isClose(0.005, 0)).toBe(true);
    expect(isClose(0.5, 0.52)).toBe(false);
  });
});

describe('compareGuess', () => {
  test('bonne réponse (à 2 % près)', () => {
    expect(compareGuess(100, 100)).toBe('ok');
    expect(compareGuess(101, 100)).toBe('ok');
  });

  test("dit si la réponse est plus grande ou plus petite, sans la donner", () => {
    expect(compareGuess(50, 100)).toBe('more');
    expect(compareGuess(150, 100)).toBe('less');
  });
});
