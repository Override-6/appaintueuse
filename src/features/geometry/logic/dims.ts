// Dimensions saisissables (identifiants stables, libellés dans geometry.json)
export type DimId =
  | 'side'
  | 'edge'
  | 'length'
  | 'width'
  | 'height'
  | 'base'
  | 'bigDiagonal'
  | 'smallDiagonal'
  | 'baseLarge'
  | 'baseSmall'
  | 'radius'
  | 'radiusOuter'
  | 'radiusInner'
  | 'radiusLarge'
  | 'radiusSmall';

// Valeurs numériques par dimension (NaN ou absente = incomplète)
export type Dims = Record<string, number>;

// Lettre affichée sur le schéma et dans le champ (couleur assortie)
export const DIM_LETTERS: Record<DimId, string> = {
  side: 'c',
  edge: 'a',
  length: 'L',
  width: 'l',
  height: 'h',
  base: 'b',
  bigDiagonal: 'D',
  smallDiagonal: 'd',
  baseLarge: 'B',
  baseSmall: 'b',
  radius: 'r',
  radiusOuter: 'R',
  radiusInner: 'r',
  radiusLarge: 'R',
  radiusSmall: 'r',
};
