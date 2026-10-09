import React from 'react';
import {DimLetter, Guide, DiagramProps, Outline, Oval, Shape, isOn} from './diagramParts';

// Cône : profil (rayon r, hauteur h) et patron de la paroi (secteur)
export function ConeDiagram({selected}: DiagramProps) {
  const on = (id: string) => isOn(selected, id);
  return (
    <>
      <Outline points="70,40 120,180 20,180" />
      <Oval cx={70} cy={200} rx={50} ry={14} on={on('base')} part="base" />
      <Guide x1={70} y1={40} x2={70} y2={180} dashed />
      <DimLetter x={20} y={116} dim="height" index={1} />
      <DimLetter x={95} y={236} dim="radius" index={0} />
      <Shape d="M 230 150 L 230 65 A 85 85 0 1 1 145 150 Z" on={on('lateral')} part="lateral" at={[230, 196]} />
    </>
  );
}

// Cône tronqué : profil (grand rayon R, petit rayon r, hauteur h) et patron de la paroi
export function TruncatedConeDiagram({selected}: DiagramProps) {
  const on = (id: string) => isOn(selected, id);
  return (
    <>
      <Outline points="45,50 95,50 120,170 20,170" />
      <Oval cx={70} cy={50} rx={25} ry={8} on={on('top')} part="top" />
      <Oval cx={70} cy={170} rx={50} ry={12} on={on('bottom')} part="bottom" />
      <Guide x1={126} y1={50} x2={126} y2={170} dashed />
      <DimLetter x={138} y={116} dim="height" index={2} />
      <DimLetter x={70} y={18} dim="radiusSmall" index={1} />
      <DimLetter x={95} y={204} dim="radiusLarge" index={0} />
      <Shape d="M 230 70 A 80 80 0 1 1 150 150 L 190 150 A 40 40 0 1 0 230 110 Z" on={on('lateral')} part="lateral" at={[230, 214]} />
    </>
  );
}
