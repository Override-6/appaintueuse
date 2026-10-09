// Rendement théorique (m²/L) = extrait sec (%) × 10 ÷ épaisseur sèche (µm)
export const spreadingRate = (solidsPercent: number, dryMicrons: number) =>
  (solidsPercent * 10) / dryMicrons;

// Litres = surface × couches ÷ rendement × (1 + perte)
export const litersNeeded = (
  area: number,
  coats: number,
  rate: number,
  lossPercent: number,
) => ((area * coats) / rate) * (1 + lossPercent / 100);

// Épaisseur sèche = épaisseur humide × extrait sec ÷ 100
export const dryFromWet = (wet: number, solidsPercent: number) =>
  (wet * solidsPercent) / 100;
export const wetFromDry = (dry: number, solidsPercent: number) =>
  (dry * 100) / solidsPercent;

export const netArea = (total: number, deductions: number[]) =>
  total - deductions.reduce((s, d) => s + d, 0);

// Ratio ex. [4,1,1] et quantité totale => quantité de chaque composant
export const splitMix = (ratio: number[], total: number) => {
  const sum = ratio.reduce((s, r) => s + r, 0);
  return ratio.map(r => (r / sum) * total);
};

// Diluant à ajouter pour X % de diluant par rapport au volume de peinture
export const thinnerToAdd = (paintVolume: number, thinnerPercent: number) =>
  (paintVolume * thinnerPercent) / 100;
