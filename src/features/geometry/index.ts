// Point d'entrée public de la géométrie (utilisé par le parcours peinture)
export {SURFACE_SHAPES, UNIT_TO_DM, areaToDm2, areaUnit, paintedArea, paintedAreaDm2} from './logic/surfaces';
export type {Unit} from './logic/surfaces';
export {areaSteps, toDm2Steps} from './logic/surfaceSteps';
export type {ShapeId} from './logic/geometry';
export type {Dims} from './logic/dims';
export {readInputs, inputError} from './logic/shapeInputs';
export type {InputError} from './logic/shapeInputs';
export {ShapeDiagram} from './components/diagrams/ShapeDiagram';
export {DimensionForm} from './components/DimensionForm';
export {PartsPicker} from './components/PartsPicker';
