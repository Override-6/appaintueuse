import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Chips, FormulaBlock, NumField, ResultCard, ScreenScroll} from '@/components';
import {pct, pos, unitIf} from '@/features/paint/logic/inputs';
import {dryFromWet, wetFromDry} from '@/features/paint/logic/paint';
import type {PaintScreenProps} from '@/navigation/types';
import {parseNumber} from '@/utils/format';

type Direction = 'toDry' | 'toWet';

// Épaisseur humide <-> sèche, selon le sens choisi
export function ThicknessScreen(_props: PaintScreenProps<'Thickness'>) {
  const {t} = useTranslation();
  const [mode, setMode] = useState<Direction>('toDry');
  const [wet, setWet] = useState('');
  const [dry, setDry] = useState('');
  const [solids, setSolids] = useState('');

  const solidsN = pct(parseNumber(solids));
  const wetN = pos(parseNumber(wet));
  const dryN = pos(parseNumber(dry));
  const result =
    solidsN === undefined
      ? undefined
      : mode === 'toDry'
        ? wetN !== undefined
          ? dryFromWet(wetN, solidsN)
          : undefined
        : dryN !== undefined
          ? wetFromDry(dryN, solidsN)
          : undefined;

  const formulas = t('paint.thickness.formulas', {returnObjects: true}) as string[];

  return (
    <ScreenScroll>
      <Chips
        options={[
          {id: 'toDry', label: t('paint.thickness.wetToDry')},
          {id: 'toWet', label: t('paint.thickness.dryToWet')},
        ]}
        selected={mode}
        onSelect={id => setMode(id as Direction)}
      />
      {mode === 'toDry' ? (
        <NumField label={t('paint.thickness.wet')} value={wet} onChange={setWet} unit="µm" />
      ) : (
        <NumField label={t('paint.thickness.dry')} value={dry} onChange={setDry} unit="µm" />
      )}
      <NumField label={t('paint.thickness.solids')} value={solids} onChange={setSolids} />
      <ResultCard
        label={mode === 'toDry' ? t('paint.thickness.dry') : t('paint.thickness.wet')}
        value={result}
        unit={unitIf(result, 'µm')}
      />
      <FormulaBlock lines={formulas} />
    </ScreenScroll>
  );
}
