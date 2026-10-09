import { evaluate, toFraction, fromFraction } from './calc';

describe('evaluate : priorités et opérateurs', () => {
  test('priorités', () => {
    expect(evaluate('2+3*4')).toBe(14);
    expect(evaluate('10−4÷2')).toBe(8);
    expect(evaluate('10-4/2')).toBe(8);
    expect(evaluate('2^3^2')).toBe(512);
    expect(evaluate('-2^2')).toBe(-4);
    expect(evaluate('2^-1')).toBe(0.5);
    expect(evaluate('2×-3')).toBe(-6);
    expect(evaluate('-5+2')).toBe(-3);
  });

  test('parenthèses', () => {
    expect(evaluate('(2+3)×4')).toBe(20);
    expect(evaluate('2×(3+4)÷7')).toBe(2);
    expect(evaluate('((1+2))')).toBe(3);
  });

  test('virgule et point décimal', () => {
    expect(evaluate('2,5+1')).toBe(3.5);
    expect(evaluate('2.5×2')).toBe(5);
    expect(evaluate('0,1+0,2')).toBeCloseTo(0.3);
    expect(evaluate(',5')).toBe(0.5);
  });

  test('pourcentage', () => {
    expect(evaluate('50%')).toBe(0.5);
    expect(evaluate('200×10%')).toBeCloseTo(20);
    expect(evaluate('50%×4')).toBeCloseTo(2);
  });

  test('constantes et racines', () => {
    expect(evaluate('π')).toBeCloseTo(Math.PI);
    expect(evaluate('2×π')).toBeCloseTo(2 * Math.PI);
    expect(evaluate('√16+1')).toBe(5);
    expect(evaluate('√(9)')).toBe(3);
    expect(evaluate('√2^2')).toBeCloseTo(2);
    expect(evaluate('√(2+2)×2')).toBe(4);
  });
});

describe('evaluate : erreurs', () => {
  test.each([
    '',
    '   ',
    '2+',
    '+',
    '(2+3',
    '2+3)',
    '()',
    '1/0',
    '5÷0',
    '√-4',
    'abc',
    '1..2',
    '2 3',
    '0^-1',
    '2%%%+',
  ])('« %s » est invalide', expr => {
    expect(evaluate(expr)).toBeNull();
  });

  test('expression trop longue', () => {
    expect(evaluate('1+'.repeat(150) + '1')).toBeNull();
  });
});

describe('toFraction', () => {
  test('valeurs courantes', () => {
    expect(toFraction(0.375)).toBe('3/8');
    expect(toFraction(1.5)).toBe('1 1/2');
    expect(toFraction(2)).toBe('2');
    expect(toFraction(0)).toBe('0');
    expect(toFraction(-0.75)).toBe('-3/4');
    expect(toFraction(1 / 3)).toBe('1/3');
    expect(toFraction(0.3)).toBe('3/10');
    expect(toFraction(1.984375)).toBe('1 63/64');
  });

  test('arrondi au numérateur entier proche', () => {
    expect(toFraction(1.999)).toBe('2');
    expect(toFraction(0.9999999)).toBe('1');
  });

  test('dénominateur maximal', () => {
    expect(toFraction(0.3, 4)).toBe('1/3');
  });
});

describe('fromFraction', () => {
  test('formes acceptées', () => {
    expect(fromFraction('3/8')).toBe(0.375);
    expect(fromFraction('1 1/2')).toBe(1.5);
    expect(fromFraction('5')).toBe(5);
    expect(fromFraction('-1 1/2')).toBe(-1.5);
    expect(fromFraction('0,5')).toBe(0.5);
    expect(fromFraction('1,5')).toBe(1.5);
    expect(fromFraction(' 3/8 ')).toBe(0.375);
    expect(fromFraction('3÷8')).toBe(0.375);
  });

  test('« n a÷b » avec espace (touche ␣), y compris avec espaces autour de la barre', () => {
    expect(fromFraction('1 1÷2')).toBe(1.5);
    expect(fromFraction('1 1/2')).toBe(1.5);
    expect(fromFraction('-2 3÷4')).toBe(-2.75);
    expect(fromFraction('1 1 ÷ 2')).toBe(1.5);
    expect(fromFraction('3 ÷ 8')).toBe(0.375);
    expect(fromFraction('1 3÷2')).toBeUndefined();
    expect(fromFraction('1 1÷0')).toBeUndefined();
  });

  test('formes refusées', () => {
    expect(fromFraction('3/0')).toBeUndefined();
    expect(fromFraction('1 3/2')).toBeUndefined();
    expect(fromFraction('abc')).toBeUndefined();
    expect(fromFraction('')).toBeUndefined();
  });

  test('aller-retour toFraction / fromFraction', () => {
    for (let k = 0; k <= 200; k++) {
      const x = k / 64;
      expect(fromFraction(toFraction(x))).toBeCloseTo(x, 12);
    }
  });
});

describe('pourcentage additif', () => {
  const {evaluate} = require('./calc');
  test('a + b% et a - b%', () => {
    expect(evaluate('200+10%')).toBeCloseTo(220);
    expect(evaluate('200-10%')).toBeCloseTo(180);
    expect(evaluate('50%')).toBeCloseTo(0.5);
    expect(evaluate('200×10%')).toBeCloseTo(20);
  });
});
