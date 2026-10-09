import {PARTS} from './parts';
import {SHAPES, getShape} from './geometry';
import {paintedAreaDm2} from './surfaces';

describe('SHAPES', () => {
  test('disque', () => {
    expect(getShape('circle').compute({radius: 1}).area).toBeCloseTo(Math.PI);
  });

  test('sphère', () => {
    expect(getShape('sphere').compute({radius: 3}).volume).toBeCloseTo(113.097, 2);
  });

  test('cône', () => {
    expect(getShape('cone').compute({radius: 3, height: 4}).slant).toBeCloseTo(5);
  });

  test('cône tronqué : génératrice et surface latérale π(R+r)g', () => {
    const v = getShape('truncatedCone').compute({radiusLarge: 4, radiusSmall: 1, height: 4});
    expect(v.slant).toBeCloseTo(5);
    expect(v.lateralArea).toBeCloseTo(Math.PI * 5 * 5);
    expect(v.volume).toBeCloseTo((Math.PI * 4 * (16 + 4 + 1)) / 3);
  });

  test('13 formes : 7 en 2D, 6 en 3D', () => {
    expect(SHAPES).toHaveLength(13);
    expect(SHAPES.filter(s => s.kind === '2d')).toHaveLength(7);
  });

  test('surface totale = somme des faces peignables (3D)', () => {
    const cases: [string, Record<string, number>, string][] = [
      ['cuboid', {length: 2, width: 3, height: 4}, 'surface'],
      ['cylinder', {radius: 2, height: 5}, 'surface'],
      ['cone', {radius: 3, height: 4}, 'surface'],
      ['truncatedCone', {radiusLarge: 4, radiusSmall: 1, height: 4}, 'surface'],
      ['sphere', {radius: 3}, 'surface'],
    ];
    for (const [id, dims, out] of cases) {
      const all = PARTS[id as keyof typeof PARTS].map(p => p.id);
      const sum = paintedAreaDm2(id as keyof typeof PARTS, dims, 'dm', all)!;
      expect(sum).toBeCloseTo(getShape(id as keyof typeof PARTS).compute(dims)[out]);
    }
  });
});
