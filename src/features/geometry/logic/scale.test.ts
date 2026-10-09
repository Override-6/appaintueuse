import {scaleResult} from './scale';

const base = {real: '', plan: '', ratio: '', last: 'real'} as const;

describe('scaleResult', () => {
  test('réelle depuis le plan', () => {
    const res = scaleResult({...base, plan: '2', ratio: '50', last: 'plan'});
    expect(res).toEqual({derived: 100, negative: false});
  });

  test('plan depuis la réelle', () => {
    const res = scaleResult({...base, real: '100', ratio: '50', last: 'real'});
    expect(res).toEqual({derived: 2, negative: false});
  });

  test('échelle nulle ou champ manquant : pas de résultat', () => {
    expect(scaleResult({...base, real: '5', ratio: '0'}).derived).toBeUndefined();
    expect(scaleResult({...base, real: '5'}).derived).toBeUndefined();
  });

  test('négatif : pas de résultat et signalement', () => {
    expect(scaleResult({...base, real: '-5', ratio: '2'})).toEqual({
      derived: undefined,
      negative: true,
    });
  });
});
