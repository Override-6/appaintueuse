import type {DimId, Dims} from './dims';

export type Flat2dId =
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'rhombus'
  | 'circle'
  | 'trapezoid'
  | 'ring';

export type Solid3dId =
  | 'cube'
  | 'cuboid'
  | 'cylinder'
  | 'cone'
  | 'truncatedCone'
  | 'sphere';

export type ShapeId = Flat2dId | Solid3dId;

export type Shape = {
  id: ShapeId;
  kind: '2d' | '3d';
  inputs: DimId[];
  outputs: string[];
  compute: (v: Dims) => Dims;
};

const PI = Math.PI;

// Génératrice d'un cône tronqué ou d'un cône : √(a² + h²), a = différence des rayons
export const slantOf = (horizontal: number, height: number): number =>
  Math.hypot(horizontal, height);

export const SHAPES: Shape[] = [
  {
    id: 'square',
    kind: '2d',
    inputs: ['side'],
    outputs: ['area', 'perimeter'],
    compute: ({side}) => ({area: side * side, perimeter: 4 * side}),
  },
  {
    id: 'rectangle',
    kind: '2d',
    inputs: ['length', 'width'],
    outputs: ['area', 'perimeter', 'diagonal'],
    compute: ({length, width}) => ({
      area: length * width,
      perimeter: 2 * (length + width),
      diagonal: Math.hypot(length, width),
    }),
  },
  {
    id: 'triangle',
    kind: '2d',
    inputs: ['base', 'height'],
    outputs: ['area'],
    compute: ({base, height}) => ({area: (base * height) / 2}),
  },
  {
    id: 'rhombus',
    kind: '2d',
    inputs: ['bigDiagonal', 'smallDiagonal'],
    outputs: ['area'],
    compute: ({bigDiagonal, smallDiagonal}) => ({
      area: (bigDiagonal * smallDiagonal) / 2,
    }),
  },
  {
    id: 'circle',
    kind: '2d',
    inputs: ['radius'],
    outputs: ['area', 'circumference', 'diameter'],
    compute: ({radius}) => ({
      area: PI * radius ** 2,
      circumference: 2 * PI * radius,
      diameter: 2 * radius,
    }),
  },
  {
    id: 'trapezoid',
    kind: '2d',
    inputs: ['baseLarge', 'baseSmall', 'height'],
    outputs: ['area'],
    compute: ({baseLarge, baseSmall, height}) => ({
      area: ((baseLarge + baseSmall) * height) / 2,
    }),
  },
  {
    id: 'ring',
    kind: '2d',
    inputs: ['radiusOuter', 'radiusInner'],
    outputs: ['area'],
    compute: ({radiusOuter, radiusInner}) => ({
      area: PI * (radiusOuter ** 2 - radiusInner ** 2),
    }),
  },
  {
    id: 'cube',
    kind: '3d',
    inputs: ['edge'],
    outputs: ['surface', 'volume', 'diagonal'],
    compute: ({edge}) => ({
      surface: 6 * edge ** 2,
      volume: edge ** 3,
      diagonal: Math.sqrt(3) * edge,
    }),
  },
  {
    id: 'cuboid',
    kind: '3d',
    inputs: ['length', 'width', 'height'],
    outputs: ['surface', 'volume', 'diagonal'],
    compute: ({length, width, height}) => ({
      surface: 2 * (length * width + length * height + width * height),
      volume: length * width * height,
      diagonal: Math.hypot(length, width, height),
    }),
  },
  {
    id: 'cylinder',
    kind: '3d',
    inputs: ['radius', 'height'],
    outputs: ['lateralArea', 'surface', 'volume'],
    compute: ({radius, height}) => ({
      lateralArea: 2 * PI * radius * height,
      surface: 2 * PI * radius * (radius + height),
      volume: PI * radius ** 2 * height,
    }),
  },
  {
    id: 'cone',
    kind: '3d',
    inputs: ['radius', 'height'],
    outputs: ['slant', 'lateralArea', 'surface', 'volume'],
    compute: ({radius, height}) => {
      const slant = slantOf(radius, height);
      return {
        slant,
        lateralArea: PI * radius * slant,
        surface: PI * radius * (radius + slant),
        volume: (PI * radius ** 2 * height) / 3,
      };
    },
  },
  {
    id: 'truncatedCone',
    kind: '3d',
    inputs: ['radiusLarge', 'radiusSmall', 'height'],
    outputs: ['slant', 'lateralArea', 'surface', 'volume'],
    compute: ({radiusLarge: R, radiusSmall: r, height: h}) => {
      const slant = slantOf(R - r, h);
      return {
        slant,
        lateralArea: PI * (R + r) * slant,
        surface: PI * (R + r) * slant + PI * R ** 2 + PI * r ** 2,
        volume: (PI * h * (R ** 2 + R * r + r ** 2)) / 3,
      };
    },
  },
  {
    id: 'sphere',
    kind: '3d',
    inputs: ['radius'],
    outputs: ['surface', 'volume'],
    compute: ({radius}) => ({
      surface: 4 * PI * radius ** 2,
      volume: (4 / 3) * PI * radius ** 3,
    }),
  },
];

export const getShape = (id: ShapeId): Shape =>
  SHAPES.find(s => s.id === id)!;
