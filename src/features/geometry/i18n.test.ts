import geometry from '@/i18n/locales/fr/geometry.json';
import {SURFACE_SHAPES} from './logic/surfaces';
import {areaSteps} from './logic/surfaceSteps';
import {LENGTH_UNITS} from './logic/units';
import {DIM_LETTERS} from './logic/dims';

const has = (path: string) =>
  path
    .split('.')
    .reduce<unknown>((node, k) => (node as Record<string, unknown> | undefined)?.[k], geometry) !== undefined;
const formulas = geometry.geometry.formulas as Record<string, unknown>;

describe('clés dynamiques de la géométrie', () => {
  test('13 formes, chacune avec ses formules et son nom', () => {
    for (const s of SURFACE_SHAPES) {
      expect(has(`geometry.shapes.${s.id}`)).toBe(true);
      expect(Array.isArray(formulas[s.id])).toBe(true);
    }
    expect(SURFACE_SHAPES).toHaveLength(13);
  });

  test('chaque dimension a un libellé et une lettre', () => {
    for (const s of SURFACE_SHAPES) {
      for (const dim of s.dimensions) {
        expect(has(`geometry.dims.${dim}`)).toBe(true);
        expect(DIM_LETTERS[dim]).toBeTruthy();
      }
    }
  });

  test('chaque face a son libellé (3D) et ses mots', () => {
    for (const s of SURFACE_SHAPES) {
      for (const p of s.parts) {
        expect(has(`geometry.parts.${s.id}.${p.id}.words`)).toBe(true);
        if (s.kind === '3d') expect(has(`geometry.parts.${s.id}.${p.id}.name`)).toBe(true);
      }
    }
  });

  test('toutes les étapes générées existent', () => {
    const dims: Record<string, number> = {
      side: 2, edge: 2, length: 2, width: 3, height: 4, base: 2,
      bigDiagonal: 4, smallDiagonal: 3, baseLarge: 5, baseSmall: 3,
      radius: 2, radiusOuter: 3, radiusInner: 1, radiusLarge: 4, radiusSmall: 1,
    };
    for (const unit of ['mm', 'cm', 'dm', 'm'] as const) {
      for (const s of SURFACE_SHAPES) {
        const ids = s.parts.map(p => p.id);
        for (const step of areaSteps(s.id, dims, unit, ids)) {
          expect(has(step.key)).toBe(true);
        }
      }
    }
  });

  test('unités proposées toutes traduites', () => {
    for (const u of LENGTH_UNITS) expect(has(`geometry.units.${u}`)).toBe(true);
  });
});
