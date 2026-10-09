import type {PartDef} from './calcSteps';
import type {ShapeId} from './geometry';
import {PARTS_2D} from './parts2d';
import {PARTS_3D} from './parts3d';

// Faces peignables de toutes les formes
export const PARTS: Record<ShapeId, PartDef[]> = {...PARTS_2D, ...PARTS_3D};
