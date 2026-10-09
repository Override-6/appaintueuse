export type UnitDef = {id: string; factor: number}; // factor : valeur en unité de base

export type Category = {
  id: string;
  units: UnitDef[];
  // Paire d'unités par défaut (sinon : les deux premières)
  defaults?: [string, string];
  // Conversion personnalisée (ex. température)
  custom?: {
    toBase: (unit: string, v: number) => number;
    fromBase: (unit: string, v: number) => number;
  };
};

export const CATEGORIES: Category[] = [
  {
    id: 'length', // base : mètre
    units: [
      {id: 'mm', factor: 0.001},
      {id: 'cm', factor: 0.01},
      {id: 'dm', factor: 0.1},
      {id: 'm', factor: 1},
      {id: 'dam', factor: 10},
      {id: 'hm', factor: 100},
      {id: 'km', factor: 1000},
      {id: 'um', factor: 1e-6},
    ],
  },
  {
    id: 'area', // base : m²
    defaults: ['m2', 'dm2'],
    units: [
      {id: 'mm2', factor: 1e-6},
      {id: 'cm2', factor: 1e-4},
      {id: 'dm2', factor: 0.01},
      {id: 'm2', factor: 1},
      {id: 'dam2', factor: 100},
      {id: 'hm2', factor: 10000},
      {id: 'ha', factor: 10000},
      {id: 'km2', factor: 1e6},
    ],
  },
  {
    id: 'volume', // base : litre
    units: [
      {id: 'mL', factor: 0.001},
      {id: 'cm3', factor: 0.001},
      {id: 'cL', factor: 0.01},
      {id: 'dL', factor: 0.1},
      {id: 'L', factor: 1},
      {id: 'daL', factor: 10},
      {id: 'hL', factor: 100},
      {id: 'dm3', factor: 1},
      {id: 'm3', factor: 1000},
    ],
  },
  {
    id: 'mass', // base : kg
    units: [
      {id: 'mg', factor: 1e-6},
      {id: 'cg', factor: 1e-5},
      {id: 'dg', factor: 1e-4},
      {id: 'g', factor: 0.001},
      {id: 'dag', factor: 0.01},
      {id: 'hg', factor: 0.1},
      {id: 'kg', factor: 1},
      {id: 't', factor: 1000},
    ],
  },
  {
    id: 'pressure', // base : Pa
    units: [
      {id: 'Pa', factor: 1},
      {id: 'kPa', factor: 1000},
      {id: 'bar', factor: 100000},
      {id: 'mbar', factor: 100},
      {id: 'atm', factor: 101325},
      {id: 'mmHg', factor: 133.322387415},
    ],
  },
  {
    id: 'angle', // base : degré
    units: [
      {id: 'deg', factor: 1},
      {id: 'rad', factor: 180 / Math.PI},
      {id: 'grad', factor: 0.9},
      {id: 'turn', factor: 360},
    ],
  },
  {
    id: 'speed', // base : m/s
    units: [
      {id: 'ms', factor: 1},
      {id: 'kmh', factor: 1 / 3.6},
    ],
  },
  {
    id: 'temperature', // base : °C
    units: [{id: 'C', factor: 1}, {id: 'K', factor: 1}],
    custom: {
      toBase: (u, v) => (u === 'K' ? v - 273.15 : v),
      fromBase: (u, v) => (u === 'K' ? v + 273.15 : v),
    },
  },
];

export function convert(
  category: Category,
  from: string,
  to: string,
  value: number,
): number {
  if (category.custom) {
    return category.custom.fromBase(to, category.custom.toBase(from, value));
  }
  const f = category.units.find(u => u.id === from)!.factor;
  const t = category.units.find(u => u.id === to)!.factor;
  return (value * f) / t;
}
