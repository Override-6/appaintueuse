// Unités de surface saisissables à la main
export type SurfaceUnit = 'm2' | 'dm2' | 'cm2';

// Combien de dm² dans une unité : 1 m² = 100 dm², 1 dm² = 100 cm²
const DM2_PER_UNIT: Record<SurfaceUnit, number> = {m2: 100, dm2: 1, cm2: 0.01};

// Convertit une surface saisie en dm²
export function toDm2(value: number, unit: SurfaceUnit): number {
  return value * DM2_PER_UNIT[unit];
}
