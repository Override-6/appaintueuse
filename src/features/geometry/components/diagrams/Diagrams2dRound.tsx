import React from 'react';
import {DimLetter, Disc, DiagramProps, Guide, Shape, isOn} from './diagramParts';

// Disque : rayon r
export function CircleDiagram({selected}: DiagramProps) {
  return (
    <>
      <Disc cx={160} cy={120} r={85} on={isOn(selected, 'face')} part="face" />
      <Guide x1={160} y1={120} x2={245} y2={120} />
      <DimLetter x={205} y={100} dim="radius" index={0} />
    </>
  );
}

// Couronne : rayon extérieur R et rayon intérieur r (trou en pointillé)
export function RingDiagram({selected}: DiagramProps) {
  const on = isOn(selected, 'face');
  // Deux cercles en sens inverse : l'intérieur reste vide
  const ring =
    'M70 120 a90 90 0 1 0 180 0 a90 90 0 1 0 -180 0 Z ' +
    'M110 120 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0 Z';
  return (
    <>
      <Shape d={ring} on={on} part="face" at={[160, 56]} evenOdd />
      <Guide x1={160} y1={120} x2={250} y2={120} />
      <Guide x1={160} y1={120} x2={160} y2={170} dashed />
      <DimLetter x={286} y={118} dim="radiusOuter" index={0} />
      <DimLetter x={136} y={112} dim="radiusInner" index={1} />
    </>
  );
}
