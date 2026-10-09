import {parseNumber} from '@/utils/format';

export type ComposedRow = {key: number; value: string; mode: string};

// Total des aires (mode « add » ou « sub ») ; vides et négatives sont ignorées
export function composedTotal(rows: Pick<ComposedRow, 'value' | 'mode'>[]): number {
  return rows.reduce((sum, r) => {
    const n = parseNumber(r.value);
    if (n === undefined || n < 0) return sum;
    return r.mode === 'add' ? sum + n : sum - n;
  }, 0);
}

// Au moins une aire négative saisie
export function hasNegativeRow(rows: Pick<ComposedRow, 'value'>[]): boolean {
  return rows.some(r => (parseNumber(r.value) ?? 0) < 0);
}
