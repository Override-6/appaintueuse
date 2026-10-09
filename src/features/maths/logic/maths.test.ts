import {percentVariation, solveRightTriangle} from './maths';

describe('maths', () => {
  test('pourcentages', () => {
    expect(percentVariation(50, 60)).toBeCloseTo(20);
  });

  test('triangle rectangle', () => {
    const t = solveRightTriangle({a: 3, b: 4})!;
    expect(t.c).toBeCloseTo(5);
    expect(t.angleA + t.angleB).toBeCloseTo(90);
    expect(solveRightTriangle({c: 10, angleA: 30})!.b).toBeCloseTo(5);
    expect(solveRightTriangle({a: 5, c: 3})).toBeNull();
  });
});
