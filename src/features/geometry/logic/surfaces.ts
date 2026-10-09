import type {Dims, DimId} from './dims';
import type {PartDef} from './calcSteps';
import {SHAPES, getShape} from './geometry';
import type {ShapeId} from './geometry';
import {PARTS} from './parts';
import {inputError} from './shapeInputs';

// Unités de longueur saisissables
export type Unit = 'mm' | 'cm' | 'dm' | 'm';

// Facteur de conversion d'une longueur vers le décimètre
export const UNIT_TO_DM: Record<Unit, number> = {mm: 0.01, cm: 0.1, dm: 1, m: 10};

export type SurfaceShape = {
  id: ShapeId;
  kind: '2d' | '3d';
  dimensions: DimId[];
  parts: PartDef[];
};

export const SURFACE_SHAPES: SurfaceShape[] = SHAPES.map(s => ({
  id: s.id,
  kind: s.kind,
  dimensions: s.inputs,
  parts: PARTS[s.id],
}));

// Toutes les dimensions sont des nombres finis et les règles de saisie sont respectées
export function validDims(shapeId: ShapeId, dims: Dims): boolean {
  const shape = getShape(shapeId);
  return (
    shape.inputs.every(name => Number.isFinite(dims[name])) &&
    inputError(shapeId, dims) === undefined
  );
}

// Symbole de l'unité d'aire : cm → « cm² »
export const areaUnit = (unit: Unit): string => `${unit}²`;

// Aire à peindre, dans l'unité choisie (somme des faces cochées, en unité²) ;
// undefined si saisie incomplète ou invalide
export function paintedArea(
  shapeId: ShapeId,
  dims: Dims,
  selectedPartIds: string[],
): number | undefined {
  if (!validDims(shapeId, dims)) return undefined;
  const shape = SURFACE_SHAPES.find(s => s.id === shapeId)!;
  return shape.parts
    .filter(p => selectedPartIds.includes(p.id))
    .reduce((sum, p) => sum + p.calc(dims).value, 0);
}

// Convertit une aire en unité² vers des dm² (1 cm² = 0,01 dm²)
export const areaToDm2 = (area: number, unit: Unit): number => area * UNIT_TO_DM[unit] ** 2;

// Aire à peindre en dm², utilisée par le parcours peinture qui calcule tout en dm²
export function paintedAreaDm2(
  shapeId: ShapeId,
  dims: Dims,
  unit: Unit,
  selectedPartIds: string[],
): number | undefined {
  const area = paintedArea(shapeId, dims, selectedPartIds);
  return area === undefined ? undefined : areaToDm2(area, unit);
}
