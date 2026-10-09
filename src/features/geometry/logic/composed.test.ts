import {composedTotal, hasNegativeRow} from './composed';

describe('composedTotal', () => {
  test('ajoute et soustrait', () => {
    const rows = [
      {value: '10', mode: 'add'},
      {value: '2,5', mode: 'add'},
      {value: '4', mode: 'sub'},
    ];
    expect(composedTotal(rows)).toBeCloseTo(8.5);
  });

  test('ignore les saisies vides ou négatives', () => {
    const rows = [
      {value: '', mode: 'add'},
      {value: '-3', mode: 'add'},
      {value: '5', mode: 'add'},
    ];
    expect(composedTotal(rows)).toBe(5);
  });

  test('détecte une aire négative', () => {
    expect(hasNegativeRow([{value: '-1'}])).toBe(true);
    expect(hasNegativeRow([{value: '1'}, {value: ''}])).toBe(false);
  });
});
