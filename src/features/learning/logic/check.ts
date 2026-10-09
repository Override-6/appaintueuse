// Vérification bienveillante : écart de 2 % au plus, ou 0,01 en valeur absolue
export function isClose(guess: number, answer: number): boolean {
  return Math.abs(guess - answer) <= Math.max(0.01, 0.02 * Math.abs(answer));
}

export type Comparison = 'ok' | 'more' | 'less';

// Compare un essai à la bonne réponse sans la dévoiler :
// « more » = la réponse est plus grande que l'essai, « less » = plus petite
export function compareGuess(guess: number, answer: number): Comparison {
  if (isClose(guess, answer)) {
    return 'ok';
  }
  return answer > guess ? 'more' : 'less';
}
