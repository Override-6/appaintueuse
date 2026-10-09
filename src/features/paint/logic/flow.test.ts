import {coverageDm2PerLiter} from './rate';
import {planResult, totalAreaDm2} from './plan';
import {toDm2} from './surface';

// Parcours complet avec les chiffres de l'exemple : 1 L couvre 7 m² = 700 dm²
describe('parcours « Combien de peinture ? » de bout en bout', () => {
  const rate = coverageDm2PerLiter(7, 'm2');

  test('une pièce de 350 dm² = ½ litre = 500 mL', () => {
    expect(rate).toBe(700);
    const result = planResult([{areaDm2: 350, count: 1}], rate, 0)!;
    expect(result.liters).toBeCloseTo(0.5);
    expect(result.ml).toBeCloseTo(500);
  });

  test('chaque pièce a son propre nombre d’exemplaires', () => {
    const pieces = [
      {areaDm2: 100, count: 2}, // 2 plaques identiques
      {areaDm2: 150, count: 1}, // + une autre pièce
    ];
    expect(totalAreaDm2(pieces)).toBe(350);
    expect(planResult(pieces, rate, 0)!.ml).toBeCloseTo(500);
  });

  test('une surface déjà connue en m² est convertie en dm²', () => {
    const pieces = [{areaDm2: toDm2(3.5, 'm2'), count: 1}];
    expect(pieces[0].areaDm2).toBe(350);
    expect(planResult(pieces, rate, 0)!.ml).toBeCloseTo(500);
  });

  test('la marge de 10 % ajoute 10 % de peinture', () => {
    const result = planResult([{areaDm2: 350, count: 1}], rate, 10)!;
    expect(result.withMarginMl).toBeCloseTo(550);
  });

  test('sans pièce ou sans rendement : pas de résultat', () => {
    expect(planResult([], rate, 0)).toBeUndefined();
    expect(planResult([{areaDm2: 350, count: 1}], 0, 0)).toBeUndefined();
  });
});
