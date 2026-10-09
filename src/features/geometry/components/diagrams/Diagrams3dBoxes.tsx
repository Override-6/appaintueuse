import React from 'react';
import {DimLetter, DiagramProps, Poly, isOn} from './diagramParts';

// Patron du cube : les 6 faces dépliées (arête a = 50)
export function CubeDiagram({selected}: DiagramProps) {
  const on = (id: string) => isOn(selected, id);
  return (
    <>
      <Poly points="110,20 160,20 160,70 110,70" on={on('top')} part="top" />
      <Poly points="60,70 110,70 110,120 60,120" on={on('left')} part="left" />
      <Poly points="110,70 160,70 160,120 110,120" on={on('front')} part="front" />
      <Poly points="160,70 210,70 210,120 160,120" on={on('right')} part="right" />
      <Poly points="210,70 260,70 260,120 210,120" on={on('back')} part="back" />
      <Poly points="110,120 160,120 160,170 110,170" on={on('bottom')} part="bottom" />
      <DimLetter x={135} y={200} dim="edge" index={0} />
    </>
  );
}

// Patron du pavé droit : longueur L, largeur l, hauteur h
export function CuboidDiagram({selected}: DiagramProps) {
  const on = (id: string) => isOn(selected, id);
  return (
    <>
      <Poly points="60,35 160,35 160,85 60,85" on={on('top')} part="top" />
      <Poly points="10,85 60,85 60,155 10,155" on={on('left')} part="left" />
      <Poly points="60,85 160,85 160,155 60,155" on={on('front')} part="front" />
      <Poly points="160,85 210,85 210,155 160,155" on={on('right')} part="right" />
      <Poly points="210,85 310,85 310,155 210,155" on={on('back')} part="back" />
      <Poly points="60,155 160,155 160,205 60,205" on={on('bottom')} part="bottom" />
      <DimLetter x={110} y={228} dim="length" index={0} />
      <DimLetter x={110} y={16} dim="width" index={1} />
      <DimLetter x={260} y={182} dim="height" index={2} />
    </>
  );
}
