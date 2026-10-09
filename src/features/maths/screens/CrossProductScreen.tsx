import React from 'react';
import {useTranslation} from 'react-i18next';
import {FormulaBlock, NumField, ResultCard, ScreenScroll} from '@/components';
import {CrossTable, StepList, solveCross} from '@/features/learning';
import {Hint} from '@/features/maths/components/Hint';
import {useNumericField} from '@/features/maths/hooks/useNumericField';
import type {MathsScreenProps} from '@/navigation/types';
import {formatNumber} from '@/utils/format';

// Produit en croix : « a correspond à b ; et c correspond à ? »
export function CrossProductScreen(_props: MathsScreenProps<'CrossProduct'>) {
  const {t} = useTranslation();
  const a = useNumericField();
  const b = useNumericField();
  const c = useNumericField();

  const ready = a.value !== undefined && b.value !== undefined && c.value !== undefined;
  const solved = ready ? solveCross(a.value!, b.value!, c.value!) : undefined;
  const show = (v: number | undefined) => (v === undefined ? '?' : formatNumber(v));

  return (
    <ScreenScroll>
      <Hint>{t('maths.crossProduct.intro')}</Hint>
      <NumField label={t('maths.crossProduct.a')} value={a.text} onChange={a.setText} />
      <NumField label={t('maths.crossProduct.b')} value={b.text} onChange={b.setText} />
      <NumField label={t('maths.crossProduct.c')} value={c.text} onChange={c.setText} />

      <CrossTable
        headers={[t('maths.crossProduct.left'), t('maths.crossProduct.right')]}
        knownLabel={t('maths.crossProduct.known')}
        known={[show(a.value), show(b.value)]}
        soughtLabel={t('maths.crossProduct.sought')}
        sought={[show(c.value), solved?.result === undefined ? '?' : formatNumber(solved.result)]}
      />

      <ResultCard label={t('maths.crossProduct.x')} value={solved?.result} />
      {solved ? <StepList steps={solved.steps} /> : null}
      <FormulaBlock
        lines={t('maths.crossProduct.formulas', {returnObjects: true}) as string[]}
      />
    </ScreenScroll>
  );
}
