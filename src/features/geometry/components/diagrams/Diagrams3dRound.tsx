import React from 'react';
import {DimLetter, Disc, DiagramProps, Guide, Poly, Sketch, isOn} from './diagramParts';

// Patron du cylindre : paroi (rectangle 2πr × h) et deux disques
export function CylinderDiagram({selected}: DiagramProps) {
  const on = (id: string) => isOn(selected, id);
  return (
    <>
      <Disc cx={160} cy={45} r={36} on={on('top')} part="top" />
      <Poly points="60,85 260,85 260,155 60,155" on={on('lateral')} part="lateral" />
      <Disc cx={160} cy={200} r={36} on={on('bottom')} part="bottom" />
      <Guide x1={160} y1={45} x2={196} y2={45} />
      <DimLetter x={226} y={44} dim="radius" index={0} />
      <Guide x1={272} y1={85} x2={272} y2={155} dashed />
      <DimLetter x={292} y={124} dim="height" index={1} />
    </>
  );
}

// Sphère : toute la surface (un seul « morceau »)
export function SphereDiagram({selected}: DiagramProps) {
  const on = isOn(selected, 'whole');
  return (
    <>
      <Disc cx={160} cy={120} r={85} on={on} part="whole" />
      <Sketch d="M75 120 A85 25 0 0 0 245 120" />
      <Guide x1={160} y1={120} x2={245} y2={120} />
      <DimLetter x={205} y={100} dim="radius" index={0} />
    </>
  );
}
