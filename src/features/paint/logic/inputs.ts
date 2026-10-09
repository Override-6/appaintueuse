// Filtres des valeurs saisies : undefined quand la valeur n'est pas acceptée

// Strictement positive
export const pos = (n?: number) => (n !== undefined && n > 0 ? n : undefined);

// Positive ou nulle
export const nonNeg = (n?: number) => (n !== undefined && n >= 0 ? n : undefined);

// Pourcentage : supérieur à 0 et au plus 100
export const pct = (n?: number) => (n !== undefined && n > 0 && n <= 100 ? n : undefined);

// Unité affichée uniquement quand le résultat existe
export const unitIf = (v: number | undefined, unit: string) =>
  v === undefined ? undefined : unit;
