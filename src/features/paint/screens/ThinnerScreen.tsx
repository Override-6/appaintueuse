import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FormulaBlock, NumField, ResultCard, ScreenScroll} from '@/components';
import {nonNeg, pos, unitIf} from '@/features/paint/logic/inputs';
import {thinnerToAdd} from '@/features/paint/logic/paint';
import type {PaintScreenProps} from '@/navigation/types';
import {parseNumber} from '@/utils/format';

// Dilution : diluant à ajouter (% du volume de peinture) et volume total
export function ThinnerScreen(_props: PaintScreenProps<'Thinner'>) {
  const {t} = useTranslation();
  const [paint, setPaint] = useState('');
  const [percent, setPercent] = useState('');

  const paintN = pos(parseNumber(paint));
  const percentN = nonNeg(parseNumber(percent) ?? 0);
  const thinner =
    paintN !== undefined && percentN !== undefined ? thinnerToAdd(paintN, percentN) : undefined;
  const totalVolume = paintN !== undefined && thinner !== undefined ? paintN + thinner : undefined;

  const formulas = t('paint.thinner.formulas', {returnObjects: true}) as string[];

  return (
    <ScreenScroll>
      <NumField label={t('paint.thinner.paint')} value={paint} onChange={setPaint} unit="L" />
      <NumField label={t('paint.thinner.percent')} value={percent} onChange={setPercent} />
      <ResultCard
        label={t('paint.thinner.thinner')}
        value={thinner}
        unit={unitIf(thinner, 'L')}
      />
      <ResultCard
        label={t('paint.thinner.totalVolume')}
        value={totalVolume}
        unit={unitIf(totalVolume, 'L')}
      />
      <FormulaBlock lines={formulas} />
    </ScreenScroll>
  );
}
