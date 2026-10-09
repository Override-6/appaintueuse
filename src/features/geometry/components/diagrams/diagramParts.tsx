import React, {createContext, useContext} from 'react';
import {Circle, Ellipse, Line, Path, Polygon, Text as SvgText} from 'react-native-svg';
import {useTheme} from '@/theme';
import {DIM_LETTERS} from '../../logic/dims';
import type {DimId} from '../../logic/dims';

// Palette nommée des dimensions (ordre : 1re, 2e, 3e dimension de la forme)
export const DIM_PALETTE = ['#2563eb', '#ea580c', '#16a34a'];
// Couleur des faces à peindre
export const PAINT_FILL = '#f59e0b';

export type DiagramProps = {selected: string[]};

// Aire de chaque face (ex. {lateral: '314,16 cm²'}), écrite dans la face correspondante
export const PartAreasContext = createContext<Record<string, string>>({});

// Valeurs saisies à écrire sur le schéma (ex. {radius: '5 dm'}), fournies par ShapeDiagram
export const DimValuesContext = createContext<Partial<Record<DimId, string>>>({});

export const isOn = (selected: string[], id: string): boolean =>
  selected.includes(id);

// Aire d'une face, écrite en petit au centre (halo de la couleur de la face pour rester lisible)
function AreaLabel({x, y, part, on}: {x: number; y: number; part?: string; on: boolean}) {
  const t = useTheme();
  const label = useContext(PartAreasContext)[part ?? ''];
  if (!label) {
    return null;
  }
  return (
    <SvgText
      x={x}
      y={y}
      fill={on ? '#111827' : t.text}
      stroke={on ? PAINT_FILL : t.key}
      strokeWidth={3}
      fontSize={11}
      fontWeight="700"
      textAnchor="middle">
      {label}
    </SvgText>
  );
}

type Point = [number, number];

// Centre d'un polygone « x,y x,y … » (moyenne des sommets)
function centerOf(points: string): Point {
  const pts = points.trim().split(/\s+/).map(p => p.split(',').map(Number));
  const n = pts.length;
  return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
}

// Face polygonale : peinte si cochée ; `part` = face dont on écrit l'aire, `at` = position du texte
export function Poly({points, on, part, at}: {points: string; on: boolean; part?: string; at?: Point}) {
  const t = useTheme();
  const [x, y] = at ?? centerOf(points);
  return (
    <>
      <Polygon points={points} fill={on ? PAINT_FILL : t.key} stroke={t.text} strokeWidth={2} />
      <AreaLabel x={x} y={y + 4} part={part} on={on} />
    </>
  );
}

// Disque : peint si coché
export function Disc({cx, cy, r, on, part}: {cx: number; cy: number; r: number; on: boolean; part?: string}) {
  const t = useTheme();
  return (
    <>
      <Circle cx={cx} cy={cy} r={r} fill={on ? PAINT_FILL : t.key} stroke={t.text} strokeWidth={2} />
      <AreaLabel x={cx} y={cy + Math.round(r * 0.35) + 4} part={part} on={on} />
    </>
  );
}

// Ellipse (disque vu de biais) : peinte si cochée
export function Oval({cx, cy, rx, ry, on, part}: {cx: number; cy: number; rx: number; ry: number; on: boolean; part?: string}) {
  const t = useTheme();
  return (
    <>
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={on ? PAINT_FILL : t.key} stroke={t.text} strokeWidth={2} />
      <AreaLabel x={cx} y={cy + 4} part={part} on={on} />
    </>
  );
}

// Chemin libre (secteur, anneau) : peint si coché ; `at` = position du texte d'aire
export function Shape({d, on, evenOdd, part, at}: {d: string; on: boolean; evenOdd?: boolean; part?: string; at?: Point}) {
  const t = useTheme();
  return (
    <>
      <Path
        d={d}
        fill={on ? PAINT_FILL : t.key}
        fillRule={evenOdd ? 'evenodd' : 'nonzero'}
        stroke={t.text}
        strokeWidth={2}
      />
      {at ? <AreaLabel x={at[0]} y={at[1]} part={part} on={on} /> : null}
    </>
  );
}

// Contour seul (profil, esquisse) : jamais peint
export function Outline({points}: {points: string}) {
  const t = useTheme();
  return <Polygon points={points} fill="none" stroke={t.text} strokeWidth={2} />;
}

// Arc en pointillé (ligne de repère, équateur)
export function Sketch({d}: {d: string}) {
  const t = useTheme();
  return (
    <Path d={d} fill="none" stroke={t.muted} strokeWidth={1.5} strokeDasharray="5 4" />
  );
}

// Trait de cote (pointillé pour une hauteur ou une diagonale)
export function Guide({
  x1,
  y1,
  x2,
  y2,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}) {
  const t = useTheme();
  return (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={t.muted}
      strokeWidth={1.5}
      strokeDasharray={dashed ? '5 4' : undefined}
    />
  );
}

// Lettre d'une dimension (colorée comme son champ), avec la valeur saisie dessous
export function DimLetter({
  x,
  y,
  dim,
  index,
}: {
  x: number;
  y: number;
  dim: DimId;
  index: number;
}) {
  const value = useContext(DimValuesContext)[dim];
  const color = DIM_PALETTE[index];
  return (
    <>
      <SvgText x={x} y={y} fill={color} fontSize={20} fontWeight="700" textAnchor="middle">
        {DIM_LETTERS[dim]}
      </SvgText>
      {value ? (
        <SvgText x={x} y={y + 16} fill={color} fontSize={14} fontWeight="700" textAnchor="middle">
          {value}
        </SvgText>
      ) : null}
    </>
  );
}
