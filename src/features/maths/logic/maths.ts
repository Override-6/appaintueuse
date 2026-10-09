export const percentOf = (percent: number, value: number) =>
  (percent / 100) * value;

export const percentRatio = (part: number, whole: number) =>
  (part / whole) * 100;

export const applyPercentChange = (value: number, percent: number) =>
  value * (1 + percent / 100);

export const percentVariation = (from: number, to: number) =>
  ((to - from) / from) * 100;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export type RightTriangle = {
  a: number; // côté adjacent
  b: number; // côté opposé
  c: number; // hypoténuse
  angleA: number; // degrés, angle entre a et c
  angleB: number; // degrés, angle entre b et c
};

// Triangle rectangle à partir de deux données parmi a, b, c, angleA (degrés).
export function solveRightTriangle(
  given: Partial<Record<'a' | 'b' | 'c' | 'angleA', number>>,
): RightTriangle | null {
  const {a, b, c, angleA} = given;
  let A = a;
  let B = b;
  let C = c;
  if (A !== undefined && B !== undefined) {
    C = Math.hypot(A, B);
  } else if (A !== undefined && C !== undefined) {
    if (C <= A) return null;
    B = Math.sqrt(C ** 2 - A ** 2);
  } else if (B !== undefined && C !== undefined) {
    if (C <= B) return null;
    A = Math.sqrt(C ** 2 - B ** 2);
  } else if (angleA !== undefined && angleA > 0 && angleA < 90) {
    const r = toRad(angleA);
    if (C !== undefined) {
      A = C * Math.cos(r);
      B = C * Math.sin(r);
    } else if (A !== undefined) {
      C = A / Math.cos(r);
      B = A * Math.tan(r);
    } else if (B !== undefined) {
      C = B / Math.sin(r);
      A = B / Math.tan(r);
    }
  }
  if (A === undefined || B === undefined || C === undefined) return null;
  const angleAOut = toDeg(Math.atan2(B, A));
  return {a: A, b: B, c: C, angleA: angleAOut, angleB: 90 - angleAOut};
}
