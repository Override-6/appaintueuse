import {add, chain, mul, pi, sqrt, sub} from './calcSteps';
import type {Calc, PartDef} from './calcSteps';
import {circleArea} from './parts2d';
import type {Solid3dId} from './geometry';

// Rectangle d'un pavé ou d'un cube : a × b
const rect = (id: string, a: string, b: string): PartDef => ({
  id,
  calc: d => mul(d[a], d[b]),
});

// Disque (dessus ou dessous) de rayon donné
const disc = (id: string, dim: string): PartDef => ({
  id,
  calc: d => circleArea(d[dim]),
});

// Génératrice : √(a × a + h × h)
const slant = (a: number, h: number): Calc => {
  const x = mul(a, a);
  const y = mul(h, h);
  const s = add(x.value, y.value);
  return chain(x, y, s, sqrt(s.value));
};

// Faces peignables de chaque solide (ids stables, libellés dans geometry.json)
export const PARTS_3D: Record<Solid3dId, PartDef[]> = {
  cube: [
    rect('top', 'edge', 'edge'),
    rect('bottom', 'edge', 'edge'),
    rect('front', 'edge', 'edge'),
    rect('back', 'edge', 'edge'),
    rect('left', 'edge', 'edge'),
    rect('right', 'edge', 'edge'),
  ],
  cuboid: [
    rect('top', 'length', 'width'),
    rect('bottom', 'length', 'width'),
    rect('front', 'length', 'height'),
    rect('back', 'length', 'height'),
    rect('left', 'width', 'height'),
    rect('right', 'width', 'height'),
  ],
  cylinder: [
    {
      id: 'lateral',
      calc: d => {
        const x = mul(2, d.radius);
        const y = pi(x.value);
        return chain(x, y, mul(y.value, d.height));
      },
    },
    disc('top', 'radius'),
    disc('bottom', 'radius'),
  ],
  cone: [
    {
      id: 'lateral',
      calc: d => {
        const g = slant(d.radius, d.height);
        const m = mul(d.radius, g.value);
        return chain(g, m, pi(m.value));
      },
    },
    disc('base', 'radius'),
  ],
  truncatedCone: [
    {
      id: 'lateral',
      calc: d => {
        const diff = sub(d.radiusLarge, d.radiusSmall);
        const g = slant(diff.value, d.height);
        const s = add(d.radiusLarge, d.radiusSmall);
        const m = mul(s.value, g.value);
        return chain(diff, g, s, m, pi(m.value));
      },
    },
    disc('top', 'radiusSmall'),
    disc('bottom', 'radiusLarge'),
  ],
  sphere: [
    {
      id: 'whole',
      calc: d => {
        const sq = mul(d.radius, d.radius);
        const p = pi(sq.value);
        return chain(sq, p, mul(4, p.value));
      },
    },
  ],
};
