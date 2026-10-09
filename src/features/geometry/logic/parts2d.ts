import {add, chain, div, mul, pi, sub} from './calcSteps';
import type {Calc, PartDef} from './calcSteps';
import type {Dims} from './dims';
import type {Flat2dId} from './geometry';

// Aire d'un disque : π × r × r
export const circleArea = (r: number): Calc => {
  const sq = mul(r, r);
  return chain(sq, pi(sq.value));
};

const face = (calc: (d: Dims) => Calc): PartDef[] => [{id: 'face', calc}];

// Figures planes : une seule face à peindre
export const PARTS_2D: Record<Flat2dId, PartDef[]> = {
  square: face(d => mul(d.side, d.side)),
  rectangle: face(d => mul(d.length, d.width)),
  triangle: face(d => {
    const x = mul(d.base, d.height);
    return chain(x, div(x.value, 2));
  }),
  rhombus: face(d => {
    const x = mul(d.bigDiagonal, d.smallDiagonal);
    return chain(x, div(x.value, 2));
  }),
  circle: face(d => circleArea(d.radius)),
  trapezoid: face(d => {
    const s = add(d.baseLarge, d.baseSmall);
    const m = mul(s.value, d.height);
    return chain(s, m, div(m.value, 2));
  }),
  ring: face(d => {
    const o = mul(d.radiusOuter, d.radiusOuter);
    const i = mul(d.radiusInner, d.radiusInner);
    const diff = sub(o.value, i.value);
    return chain(o, i, diff, pi(diff.value));
  }),
};
