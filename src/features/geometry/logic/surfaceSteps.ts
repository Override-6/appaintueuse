import {add} from './calcSteps';
import type {Step} from './calcSteps';
import type {Dims} from './dims';
import {formatNumber} from '@/utils/format';
import type {ShapeId} from './geometry';
import {SURFACE_SHAPES, UNIT_TO_DM, areaToDm2, areaUnit, paintedArea} from './surfaces';
import type {Unit} from './surfaces';

// Étapes pédagogiques du calcul de la surface à peindre, dans l'unité choisie (cm → cm²)
export function areaSteps(
  shapeId: ShapeId,
  dims: Dims,
  unit: Unit,
  selectedPartIds: string[],
): Step[] {
  if (paintedArea(shapeId, dims, selectedPartIds) === undefined) {
    return [];
  }
  const shape = SURFACE_SHAPES.find(s => s.id === shapeId)!;
  const steps: Step[] = [];

  let total: number | undefined;
  for (const part of shape.parts.filter(p => selectedPartIds.includes(p.id))) {
    if (shape.kind === '3d') {
      steps.push({key: `geometry.parts.${shape.id}.${part.id}.name`});
    }
    steps.push({key: `geometry.parts.${shape.id}.${part.id}.words`});
    const calc = part.calc(dims);
    steps.push(...calc.steps);

    const value = calc.value;
    if (total === undefined) {
      total = value;
    } else {
      const sum = add(total, value);
      steps.push(...sum.steps);
      total = sum.value;
    }
  }
  return steps;
}

// Étape de passage en dm², pour le parcours peinture qui calcule tout en dm² (rien si l'unité est déjà dm)
export function toDm2Steps(area: number, unit: Unit): Step[] {
  if (unit === 'dm') {
    return [];
  }
  return [
    {
      key: 'geometry.calc.toDm2',
      params: {
        unit: areaUnit(unit),
        factor: formatNumber(UNIT_TO_DM[unit] ** 2),
        area: formatNumber(area),
        dm2: formatNumber(areaToDm2(area, unit)),
      },
    },
  ];
}
