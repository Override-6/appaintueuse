import type {Dims, ShapeId, Unit} from '@/features/geometry';
import {solveCross, type CrossResult} from '@/features/learning/logic/cross';
import {describeQuantity} from '@/features/learning/logic/quantity';
import type {Step} from '@/features/learning/logic/steps';
import {formatNumber as f} from '@/utils/format';

// Une pièce à peindre : surface en dm² pour un exemplaire, et nombre d'exemplaires (≥ 1)
export type PlanPiece = {
  areaDm2: number;
  count: number;
  shapeId?: ShapeId; // absent pour une surface déjà connue
  dims?: Dims;
  unit?: Unit;
  selectedParts?: string[];
};

// Choix de marge proposés à l'écran résultat (en %)
export const MARGIN_OPTIONS = [0, 5, 10];

// Nombre d'exemplaires : entier au moins égal à 1, sinon undefined
export function parseCount(text: string): number | undefined {
  const n = Number(text.trim().replace(',', '.'));
  return text.trim() !== '' && Number.isInteger(n) && n >= 1 ? n : undefined;
}

// Surface totale : chaque pièce compte sa surface × son nombre d'exemplaires
export function totalAreaDm2(pieces: PlanPiece[]): number {
  return pieces.reduce((sum, p) => sum + p.areaDm2 * p.count, 0);
}

// Petit calcul de la surface totale : « A × n + B = total »
export function totalSteps(pieces: PlanPiece[]): Step[] {
  if (pieces.length === 0) return [];
  const total = f(totalAreaDm2(pieces));
  if (pieces.length === 1 && pieces[0].count === 1) {
    return [{key: 'paint.guide.plan.one', params: {total}}];
  }
  const values = pieces
    .map(p => (p.count === 1 ? f(p.areaDm2) : `${f(p.areaDm2)} × ${f(p.count)}`))
    .join(' + ');
  return [{key: 'paint.guide.plan.sum', params: {values, total}}];
}

export type PlanResult = {
  total: number; // dm²
  totalSteps: Step[];
  cross: CrossResult; // produit en croix dm² ↔ litres
  liters: number; // litres exacts, sans marge
  ml: number; // millilitres exacts, sans marge
  withMargin: number; // litres avec marge de sécurité
  withMarginMl: number; // millilitres avec marge de sécurité
  quantity: Step; // phrase de plausibilité (sans marge)
};

// Résultat complet, ou undefined si une donnée manque ou n'est pas plausible
export function planResult(
  pieces: PlanPiece[],
  rateDm2PerL: number,
  marginPct: number,
): PlanResult | undefined {
  if (pieces.length === 0 || !(rateDm2PerL > 0) || !(marginPct >= 0)) return undefined;
  const total = totalAreaDm2(pieces);
  const liters = total / rateDm2PerL;
  const withMargin = liters * (1 + marginPct / 100);
  return {
    total,
    totalSteps: totalSteps(pieces),
    cross: solveCross(rateDm2PerL, 1, total),
    liters,
    ml: liters * 1000,
    withMargin,
    withMarginMl: withMargin * 1000,
    quantity: describeQuantity(liters),
  };
}
