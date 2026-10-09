import {inputError, readInputs} from './shapeInputs';

describe('readInputs', () => {
  test('virgule acceptée, vide ou invalide = NaN', () => {
    const nums = readInputs(['length', 'width'], {length: '1,5', width: 'abc'});
    expect(nums.length).toBe(1.5);
    expect(nums.width).toBeNaN();
  });
});

describe('inputError', () => {
  test('dimension négative', () => {
    const nums = readInputs(['radius'], {radius: '-2'});
    expect(inputError('circle', nums)).toBe('negative');
  });

  test('couronne : rayon intérieur supérieur à l’extérieur', () => {
    const nums = readInputs(['radiusOuter', 'radiusInner'], {
      radiusOuter: '2',
      radiusInner: '3',
    });
    expect(inputError('ring', nums)).toBe('invalidRing');
  });

  test('cône tronqué : petit rayon supérieur au grand', () => {
    const nums = readInputs(['radiusLarge', 'radiusSmall', 'height'], {
      radiusLarge: '2',
      radiusSmall: '3',
      height: '4',
    });
    expect(inputError('truncatedCone', nums)).toBe('invalidCone');
  });

  test('saisies valides', () => {
    const nums = readInputs(['radiusOuter', 'radiusInner'], {
      radiusOuter: '3',
      radiusInner: '2',
    });
    expect(inputError('ring', nums)).toBeUndefined();
  });
});
