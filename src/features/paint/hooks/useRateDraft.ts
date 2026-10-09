import {pos} from '@/features/paint/logic/inputs';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import {rateSteps, coverageDm2PerLiter, type AreaUnit} from '../logic/rate';
import type {RateDraft} from '../logic/persist';
import {parseNumber} from '@/utils/format';
import type {Step} from '@/features/learning/logic/steps';

// Rendement en dm² par litre, validé ; undefined si une saisie n'est pas plausible.
// Le formulaire est gardé dans le contexte : il survit à Retour et à la fermeture de l'app.
export function useRateDraft() {
  const {rateDraft: draft, setRateDraft} = usePaintPlan();
  const set = <K extends keyof RateDraft>(key: K, value: RateDraft[K]) =>
    setRateDraft({...draft, [key]: value});

  const byMl = draft.mode === 'ml';
  const area = pos(parseNumber(byMl ? draft.mlArea : draft.area));
  const unit: AreaUnit = byMl ? draft.mlUnit : 'm2';
  const ml = byMl ? pos(parseNumber(draft.ml)) : undefined;
  const rate =
    area === undefined || (byMl && ml === undefined)
      ? undefined
      : coverageDm2PerLiter(area, unit, ml);
  const steps: Step[] = rate === undefined || area === undefined ? [] : rateSteps(area, unit, ml);

  return {draft, set, rate, steps};
}
