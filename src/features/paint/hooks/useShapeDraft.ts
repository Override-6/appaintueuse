import {
  SURFACE_SHAPES,
  areaSteps,
  inputError,
  paintedArea,
  areaToDm2,
  toDm2Steps,
  readInputs,
  type InputError,
  type ShapeId,
  type Unit,
} from '@/features/geometry';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import type {PlanPiece} from '../logic/plan';
import {parseCount} from '../logic/plan';
import {blankShapeDraft, type ShapeDraft} from '../logic/persist';

const ERROR_KEYS: Record<InputError, string> = {
  negative: 'geometry.negative',
  invalidRing: 'geometry.invalidRing',
  invalidCone: 'geometry.invalidCone',
};

// Saisie d'une pièce : le brouillon du contexte si c'est la même forme, sinon un brouillon vierge
export function useShapeDraft(shapeId: ShapeId) {
  const shape = SURFACE_SHAPES.find(s => s.id === shapeId)!;
  const {shapeDraft, setShapeDraft} = usePaintPlan();
  const draft: ShapeDraft =
    shapeDraft?.shapeId === shapeId ? shapeDraft : blankShapeDraft(shapeId);
  const {unit, vals, parts} = draft;

  const setVal = (dim: string, value: string) =>
    setShapeDraft({...draft, vals: {...vals, [dim]: value}});
  const setUnit = (next: Unit) => setShapeDraft({...draft, unit: next});
  const setParts = (next: string[]) => setShapeDraft({...draft, parts: next});
  const setCountText = (next: string) => setShapeDraft({...draft, count: next});

  const dims = readInputs(shape.dimensions, vals);
  const err = inputError(shape.id, dims);
  // Le résultat s'affiche dans l'unité choisie ; le plan de peinture, lui, compte en dm²
  const area = paintedArea(shape.id, dims, parts);
  const areaDm2 = area === undefined ? undefined : areaToDm2(area, unit);
  const steps = areaSteps(shape.id, dims, unit, parts);
  const dm2Steps = area === undefined ? [] : toDm2Steps(area, unit);
  const count = parseCount(draft.count);

  const message =
    err !== undefined
      ? ERROR_KEYS[err]
      : parts.length === 0
        ? 'paint.guide.dimensions.noPart'
        : area === 0
          ? 'paint.guide.dimensions.zero'
          : undefined;

  const piece: PlanPiece | undefined =
    areaDm2 !== undefined && areaDm2 > 0 && message === undefined && count !== undefined
      ? {areaDm2, count, shapeId: shape.id, dims, unit, selectedParts: parts}
      : undefined;

  return {
    shape,
    unit,
    setUnit,
    vals,
    setVal,
    parts,
    setParts,
    area,
    areaDm2,
    steps,
    dm2Steps,
    message,
    countText: draft.count,
    setCountText,
    countValid: count !== undefined,
    piece,
  };
}
