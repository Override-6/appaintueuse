import {areaSteps, toDm2Steps} from './surfaceSteps';
import {areaToDm2, areaUnit, paintedArea, paintedAreaDm2} from './surfaces';

describe('paintedAreaDm2', () => {
  test('rectangle en dm : 3 × 2 = 6 dm²', () => {
    expect(paintedAreaDm2('rectangle', {length: 3, width: 2}, 'dm', ['face'])).toBeCloseTo(6);
  });

  test('conversion : 100 cm × 100 cm = 1 m² = 100 dm²', () => {
    expect(paintedAreaDm2('square', {side: 100}, 'cm', ['face'])).toBeCloseTo(100);
  });

  test('conversion : 1 m × 1 m = 100 dm²', () => {
    expect(paintedAreaDm2('square', {side: 1}, 'm', ['face'])).toBeCloseTo(100);
  });

  test('pavé : seules les faces cochées comptent', () => {
    const dims = {length: 2, width: 3, height: 4};
    expect(paintedAreaDm2('cuboid', dims, 'dm', ['top'])).toBeCloseTo(6);
    expect(paintedAreaDm2('cuboid', dims, 'dm', ['top', 'front'])).toBeCloseTo(14);
  });

  test('cylindre : paroi = 2πrh', () => {
    const v = paintedAreaDm2('cylinder', {radius: 1, height: 2}, 'dm', ['lateral']);
    expect(v).toBeCloseTo(4 * Math.PI);
  });

  test('tronc : paroi = π(R+r)g, g = 5', () => {
    const v = paintedAreaDm2(
      'truncatedCone',
      {radiusLarge: 4, radiusSmall: 1, height: 4},
      'dm',
      ['lateral'],
    );
    expect(v).toBeCloseTo(Math.PI * 5 * 5);
  });

  test('dimensions incomplètes ou invalides : undefined', () => {
    expect(paintedAreaDm2('rectangle', {length: 3}, 'dm', ['face'])).toBeUndefined();
    expect(paintedAreaDm2('rectangle', {length: -3, width: 2}, 'dm', ['face'])).toBeUndefined();
    expect(paintedAreaDm2('ring', {radiusOuter: 2, radiusInner: 3}, 'dm', ['face'])).toBeUndefined();
    expect(
      paintedAreaDm2('truncatedCone', {radiusLarge: 1, radiusSmall: 3, height: 2}, 'dm', ['lateral']),
    ).toBeUndefined();
  });
});

describe('areaSteps', () => {
  test('pas de dimensions valides : aucune étape', () => {
    expect(areaSteps('square', {side: NaN}, 'dm', ['face'])).toEqual([]);
  });

  test('le calcul en dm n\'ajoute pas de conversion', () => {
    const keys = areaSteps('rectangle', {length: 3, width: 2}, 'dm', ['face']).map(s => s.key);
    expect(keys).toEqual([
      'geometry.parts.rectangle.face.words',
      'geometry.calc.mul',
    ]);
  });

  test('en cm : tout reste en cm, sans conversion cachée vers les dm²', () => {
    const steps = areaSteps('cuboid', {length: 10, width: 10, height: 10}, 'cm', ['top', 'bottom']);
    expect(steps.map(s => s.key)).not.toContain('geometry.calc.unitFactor');
    expect(steps[steps.length - 1].key).toBe('geometry.calc.add');
    expect(steps[steps.length - 1].params?.result).toBe('200'); // 100 cm² + 100 cm²
  });
});

describe('aire dans l\'unité choisie', () => {
  const cube = {length: 10, width: 10, height: 10};

  test('paintedArea donne des cm² quand on mesure en cm', () => {
    expect(paintedArea('cuboid', cube, ['top', 'bottom'])).toBe(200);
    expect(areaUnit('cm')).toBe('cm²');
  });

  test('le passage en dm² est une conversion à part (1 cm² = 0,01 dm²)', () => {
    expect(areaToDm2(200, 'cm')).toBeCloseTo(2);
    expect(areaToDm2(5, 'dm')).toBe(5);
    expect(paintedAreaDm2('cuboid', cube, 'cm', ['top', 'bottom'])).toBeCloseTo(2);
  });

  test('toDm2Steps explique le passage, sauf si on est déjà en dm', () => {
    const [step] = toDm2Steps(200, 'cm');
    expect(step.key).toBe('geometry.calc.toDm2');
    expect(step.params).toMatchObject({unit: 'cm²', dm2: '2'});
    expect(toDm2Steps(200, 'dm')).toEqual([]);
  });

  test('aire invalide : rien', () => {
    expect(paintedArea('cuboid', {length: NaN, width: 1, height: 1}, ['top'])).toBeUndefined();
  });
});
