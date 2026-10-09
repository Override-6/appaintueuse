import {describeQuantity} from './quantity';

describe('describeQuantity', () => {
  test('quantité nulle ou négative', () => {
    expect(describeQuantity(0).key).toBe('learning.quantity.zero');
    expect(describeQuantity(-2).key).toBe('learning.quantity.zero');
    expect(describeQuantity(NaN).key).toBe('learning.quantity.zero');
  });

  test('très petite quantité', () => {
    expect(describeQuantity(0.1)).toEqual({key: 'learning.quantity.tiny'});
  });

  test('proche d\'un repère : « environ »', () => {
    expect(describeQuantity(0.25)).toEqual({key: 'learning.quantity.about.quarter'});
    expect(describeQuantity(0.5)).toEqual({key: 'learning.quantity.about.half'});
    expect(describeQuantity(0.97)).toEqual({key: 'learning.quantity.about.one'});
  });

  test('entre deux repères : un peu moins ou un peu plus', () => {
    expect(describeQuantity(0.45)).toEqual({key: 'learning.quantity.between.quarter'});
    expect(describeQuantity(0.8)).toEqual({key: 'learning.quantity.between.threeQuarters'});
  });

  test('pots de 1 litre à partir d\'un litre', () => {
    expect(describeQuantity(1)).toEqual({key: 'learning.quantity.pot'});
    expect(describeQuantity(3)).toEqual({key: 'learning.quantity.pots', params: {n: '3'}});
    expect(describeQuantity(2.4)).toEqual({
      key: 'learning.quantity.potsBetween',
      params: {low: '2', high: '3'},
    });
  });
});
