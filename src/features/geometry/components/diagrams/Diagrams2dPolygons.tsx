import React from 'react';
import {DimLetter, Guide, DiagramProps, Poly, isOn} from './diagramParts';

// Carré : côté c
export function SquareDiagram({selected}: DiagramProps) {
  return (
    <>
      <Poly points="100,40 220,40 220,160 100,160" on={isOn(selected, 'face')} part="face" />
      <DimLetter x={160} y={196} dim="side" index={0} />
    </>
  );
}

// Rectangle : longueur L et largeur l
export function RectangleDiagram({selected}: DiagramProps) {
  return (
    <>
      <Poly points="60,60 260,60 260,160 60,160" on={isOn(selected, 'face')} part="face" />
      <DimLetter x={160} y={196} dim="length" index={0} />
      <DimLetter x={286} y={116} dim="width" index={1} />
    </>
  );
}

// Triangle : base b et hauteur h (pointillé)
export function TriangleDiagram({selected}: DiagramProps) {
  return (
    <>
      <Poly points="60,170 260,170 160,50" on={isOn(selected, 'face')} part="face" at={[160, 146]} />
      <Guide x1={160} y1={50} x2={160} y2={170} dashed />
      <DimLetter x={160} y={200} dim="base" index={0} />
      <DimLetter x={182} y={116} dim="height" index={1} />
    </>
  );
}

// Losange : grande diagonale D et petite diagonale d
export function RhombusDiagram({selected}: DiagramProps) {
  return (
    <>
      <Poly points="160,40 260,120 160,200 60,120" on={isOn(selected, 'face')} part="face" />
      <Guide x1={60} y1={120} x2={260} y2={120} dashed />
      <Guide x1={160} y1={40} x2={160} y2={200} dashed />
      <DimLetter x={286} y={126} dim="bigDiagonal" index={0} />
      <DimLetter x={160} y={224} dim="smallDiagonal" index={1} />
    </>
  );
}

// Trapèze : grande base B, petite base b, hauteur h
export function TrapezoidDiagram({selected}: DiagramProps) {
  return (
    <>
      <Poly points="60,180 260,180 220,70 100,70" on={isOn(selected, 'face')} part="face" at={[185, 160]} />
      <Guide x1={100} y1={70} x2={100} y2={180} dashed />
      <DimLetter x={160} y={214} dim="baseLarge" index={0} />
      <DimLetter x={160} y={48} dim="baseSmall" index={1} />
      <DimLetter x={124} y={116} dim="height" index={2} />
    </>
  );
}

