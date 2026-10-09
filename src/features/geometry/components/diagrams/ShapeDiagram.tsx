import React from 'react';
import Svg from 'react-native-svg';
import type {ShapeId} from '../../logic/geometry';
import {CircleDiagram, RingDiagram} from './Diagrams2dRound';
import {
  RectangleDiagram,
  RhombusDiagram,
  SquareDiagram,
  TrapezoidDiagram,
  TriangleDiagram,
} from './Diagrams2dPolygons';
import {CubeDiagram, CuboidDiagram} from './Diagrams3dBoxes';
import {ConeDiagram, TruncatedConeDiagram} from './Diagrams3dCone';
import {CylinderDiagram, SphereDiagram} from './Diagrams3dRound';
import {DimValuesContext, PartAreasContext} from './diagramParts';
import type {DiagramProps} from './diagramParts';
import type {DimId} from '../../logic/dims';
import {readInputs} from '../../logic/shapeInputs';
import {SURFACE_SHAPES, areaUnit, paintedArea} from '../../logic/surfaces';
import type {Unit} from '../../logic/surfaces';
import {formatNumber} from '@/utils/format';

const DIAGRAMS: Record<ShapeId, (p: DiagramProps) => React.JSX.Element> = {
  square: SquareDiagram,
  rectangle: RectangleDiagram,
  triangle: TriangleDiagram,
  rhombus: RhombusDiagram,
  circle: CircleDiagram,
  trapezoid: TrapezoidDiagram,
  ring: RingDiagram,
  cube: CubeDiagram,
  cuboid: CuboidDiagram,
  cylinder: CylinderDiagram,
  cone: ConeDiagram,
  truncatedCone: TruncatedConeDiagram,
  sphere: SphereDiagram,
};

type Props = {
  shapeId: ShapeId;
  selectedParts?: string[];
  width?: number;
  /** Valeurs saisies (par dimension) à écrire sur le schéma, avec l'unité */
  values?: Record<string, string>;
  unit?: Unit;
  /** Écrit l'aire dans chaque face (à désactiver pour ne pas dévoiler un résultat à trouver) */
  showAreas?: boolean;
};

// « 5 » + « dm » → « 5 dm » ; rien tant que le champ est vide
function labelsOf(values: Record<string, string>, unit: string) {
  const labels: Partial<Record<DimId, string>> = {};
  for (const [dim, text] of Object.entries(values)) {
    if (text.trim() !== '') {
      labels[dim as DimId] = `${text.trim()} ${unit}`;
    }
  }
  return labels;
}

// Aire de chaque face dans l'unité choisie (« 314,16 cm² »), seulement quand les mesures sont valides
function areasOf(shapeId: ShapeId, values: Record<string, string>, unit: Unit) {
  const shape = SURFACE_SHAPES.find(s => s.id === shapeId);
  const areas: Record<string, string> = {};
  if (!shape) {
    return areas;
  }
  const dims = readInputs(shape.dimensions, values);
  for (const part of shape.parts) {
    const area = paintedArea(shapeId, dims, [part.id]);
    if (area !== undefined && Number.isFinite(area)) {
      areas[part.id] = `${formatNumber(Math.round(area * 100) / 100)} ${areaUnit(unit)}`;
    }
  }
  return areas;
}

// Schéma d'une forme ; les faces cochées sont peintes (3D : patron dépliée)
export function ShapeDiagram({shapeId, selectedParts = [], width = 300, values = {}, unit = 'cm', showAreas = true}: Props) {
  const Diagram = DIAGRAMS[shapeId];
  return (
    <Svg width={width} height={(width * 262) / 320} viewBox="0 0 320 262">
      <DimValuesContext.Provider value={labelsOf(values, unit)}>
        <PartAreasContext.Provider value={showAreas ? areasOf(shapeId, values, unit) : {}}>
          <Diagram selected={selectedParts} />
        </PartAreasContext.Provider>
      </DimValuesContext.Provider>
    </Svg>
  );
}
