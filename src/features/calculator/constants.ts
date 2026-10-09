export const MAX_LEN = 200; // longueur max de l'expression
export const MAX_HISTORY = 30;
export const CLEAR_RED = '#dc2626'; // C : rouge vif
export const BACK_RED = '#fca5a5'; // ⌫ : rouge doux

// Types partagés par les composants de la calculatrice
export type HistoryItem = {expr: string; value: number};
export type Sel = {start: number; end: number};
export type KeyDef = {k: string; kind?: 'op' | 'clear' | 'back'};

export const ROWS: KeyDef[][] = [
  [
    {k: 'C', kind: 'clear'},
    {k: '⌫', kind: 'back'},
    {k: '◀', kind: 'op'},
    {k: '▶', kind: 'op'},
  ],
  [
    {k: '(', kind: 'op'},
    {k: ')', kind: 'op'},
    {k: '%', kind: 'op'},
    {k: '÷', kind: 'op'},
  ],
  [{k: '7'}, {k: '8'}, {k: '9'}, {k: '×', kind: 'op'}],
  [{k: '4'}, {k: '5'}, {k: '6'}, {k: '−', kind: 'op'}],
  [{k: '1'}, {k: '2'}, {k: '3'}, {k: '+', kind: 'op'}],
];

// Fonctions repliables : √, x², xʸ, π, fraction→décimal, décimal→fraction
// « space » insère une espace (saisie d'un nombre mixte « 1 1÷2 » pour fraction→décimal)
export const FUNCS = [
  '√',
  'x²',
  'xʸ',
  'π',
  'space',
  'fracToDec',
  'decToFrac',
] as const;
export type FuncId = (typeof FUNCS)[number];
