import {parseNumber} from '@/utils/format';
import type {Dims} from './dims';
import {getShape} from './geometry';
import type {ShapeId} from './geometry';

export type InputError = 'negative' | 'invalidRing' | 'invalidCone';

// Saisies lues en nombres : absente ou invalide = NaN
export function readInputs(
  names: string[],
  vals: Record<string, string>,
): Dims {
  const nums: Dims = {};
  for (const name of names) {
    nums[name] = parseNumber(vals[name] ?? '') ?? NaN;
  }
  return nums;
}

// Dimension négative, couronne ou cône tronqué dont le petit rayon dépasse le grand
export function inputError(id: ShapeId, nums: Dims): InputError | undefined {
  if (getShape(id).inputs.some(name => nums[name] < 0)) return 'negative';
  if (id === 'ring' && nums.radiusInner > nums.radiusOuter) return 'invalidRing';
  if (id === 'truncatedCone' && nums.radiusLarge < nums.radiusSmall) {
    return 'invalidCone';
  }
  return undefined;
}
