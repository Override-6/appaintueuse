import type {Step} from '@/features/learning/logic/steps';
import {formatNumber as f} from '@/utils/format';
import {toDm2} from './surface';

// Unités de surface couverte par la peinture
export type AreaUnit = 'm2' | 'dm2';

export const DEFAULT_COVERAGE_M2 = 7; // un litre couvre 7 m² par défaut

// Rendement en dm² par litre : « 1 L couvre area » ou « ml mL couvrent area »
export function coverageDm2PerLiter(area: number, unit: AreaUnit, ml?: number): number {
  const dm2 = toDm2(area, unit);
  return ml === undefined ? dm2 : (dm2 * 1000) / ml;
}

// Étapes de conversion vers des dm² par litre (clés de paint.json)
export function rateSteps(area: number, unit: AreaUnit, ml?: number): Step[] {
  const dm2 = toDm2(area, unit);
  const steps: Step[] = [];
  if (unit === 'm2') {
    steps.push({key: 'paint.guide.rate.m2', params: {area: f(area), dm2: f(dm2)}});
  }
  if (ml !== undefined) {
    steps.push({
      key: 'paint.guide.rate.ml',
      params: {dm2: f(dm2), ml: f(ml), rate: f(coverageDm2PerLiter(area, unit, ml))},
    });
  }
  return steps;
}
