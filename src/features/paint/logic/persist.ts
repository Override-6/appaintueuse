import type {ShapeId} from '@/features/geometry/logic/geometry';
import {SURFACE_SHAPES, type Unit} from '@/features/geometry/logic/surfaces';
import {DEFAULT_COVERAGE_M2, coverageDm2PerLiter, type AreaUnit} from './rate';
import type {PlanPiece} from './plan';
import type {SurfaceUnit} from './surface';

// Clé de stockage : la version change si la forme des données change
export const PAINT_PLAN_KEY = 'paint.plan.v1';

// Brouillon d'une pièce à mesurer ; count est le texte saisi
export type ShapeDraft = {
  shapeId: ShapeId;
  vals: Record<string, string>;
  unit: Unit;
  parts: string[];
  count: string;
};

// Brouillon d'une surface déjà connue
export type KnownDraft = {value: string; unit: SurfaceUnit; count: string};

export type RateMode = 'area' | 'ml';

// Saisies brutes de l'écran rendement : mode, surface par litre, ou mL et surface couverte
export type RateDraft = {
  mode: RateMode;
  area: string; // « m² par litre »
  ml: string; // quantité de peinture en mL
  mlArea: string; // surface couverte par ces mL
  mlUnit: AreaUnit;
};

// Tout ce qui est gardé entre deux ouvertures de l'app
export type PaintPlanData = {
  pieces: PlanPiece[];
  rateDm2PerL: number;
  shapeDraft?: ShapeDraft;
  knownDraft?: KnownDraft;
  rateDraft: RateDraft;
};

export const DEFAULT_RATE_DM2_PER_L = coverageDm2PerLiter(DEFAULT_COVERAGE_M2, 'm2');

export const EMPTY_RATE_DRAFT: RateDraft = {
  mode: 'area',
  area: String(DEFAULT_COVERAGE_M2),
  ml: '',
  mlArea: '',
  mlUnit: 'm2',
};

// Brouillon vierge pour une forme : toutes les faces cochées, 1 exemplaire, unité cm
export function blankShapeDraft(shapeId: ShapeId): ShapeDraft {
  const shape = SURFACE_SHAPES.find(s => s.id === shapeId)!;
  return {
    shapeId,
    vals: {},
    unit: 'cm',
    parts: shape.parts.map(p => p.id),
    count: '1',
  };
}

// Brouillon vierge pour une surface connue : unité dm² (la peintre travaille en dm²)
export const blankKnownDraft = (): KnownDraft => ({value: '', unit: 'dm2', count: '1'});

// Un brouillon « non vide » a au moins une mesure saisie
export const isShapeDraftFilled = (d: ShapeDraft) =>
  Object.values(d.vals).some(v => v.trim() !== '');
export const isKnownDraftFilled = (d: KnownDraft) => d.value.trim() !== '';

const UNITS: readonly Unit[] = ['mm', 'cm', 'dm', 'm'];
const SURFACE_UNITS: readonly SurfaceUnit[] = ['m2', 'dm2', 'cm2'];
const AREA_UNITS: readonly AreaUnit[] = ['m2', 'dm2'];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isStrArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
const isStrMap = (v: unknown): v is Record<string, string> =>
  isRecord(v) && Object.values(v).every(isStr);
const isNumMap = (v: unknown): v is Record<string, number> =>
  isRecord(v) && Object.values(v).every(n => typeof n === 'number' && Number.isFinite(n));
const isPositive = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0;
const isCount = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 1;
const oneOf =
  <T extends string>(list: readonly T[]) =>
  (v: unknown): v is T =>
    typeof v === 'string' && (list as readonly string[]).includes(v);
const isUnit = oneOf(UNITS);
const isSurfaceUnit = oneOf(SURFACE_UNITS);
const isAreaUnit = oneOf(AREA_UNITS);
const isShapeId = (v: unknown): v is ShapeId =>
  typeof v === 'string' && SURFACE_SHAPES.some(s => s.id === v);
// Champ facultatif : absent, ou valide
const optional = <T>(guard: (v: unknown) => v is T) => (v: unknown) =>
  v === undefined || guard(v);

const isPiece = (v: unknown): v is PlanPiece =>
  isRecord(v) &&
  isPositive(v.areaDm2) &&
  isCount(v.count) &&
  optional(isShapeId)(v.shapeId) &&
  optional(isNumMap)(v.dims) &&
  optional(isUnit)(v.unit) &&
  optional(isStrArray)(v.selectedParts);

const isShapeDraft = (v: unknown): v is ShapeDraft =>
  isRecord(v) &&
  isShapeId(v.shapeId) &&
  isStrMap(v.vals) &&
  isUnit(v.unit) &&
  isStrArray(v.parts) &&
  isStr(v.count);

const isKnownDraft = (v: unknown): v is KnownDraft =>
  isRecord(v) && isStr(v.value) && isSurfaceUnit(v.unit) && isStr(v.count);

const isRateDraft = (v: unknown): v is RateDraft =>
  isRecord(v) &&
  oneOf<RateMode>(['area', 'ml'])(v.mode) &&
  isStr(v.area) &&
  isStr(v.ml) &&
  isStr(v.mlArea) &&
  isAreaUnit(v.mlUnit);

// Données complètes et bien formées, sinon false (on repart alors d'un état propre)
export function isPaintPlanData(v: unknown): v is PaintPlanData {
  return (
    isRecord(v) &&
    Array.isArray(v.pieces) &&
    v.pieces.every(isPiece) &&
    isPositive(v.rateDm2PerL) &&
    optional(isShapeDraft)(v.shapeDraft) &&
    optional(isKnownDraft)(v.knownDraft) &&
    isRateDraft(v.rateDraft)
  );
}
