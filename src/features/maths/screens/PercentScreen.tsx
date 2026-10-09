import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Chips, FormulaBlock, NumField, ResultCard, ScreenScroll} from '@/components';
import {
  applyPercentChange,
  percentOf,
  percentRatio,
  percentVariation,
} from '@/features/maths/logic/maths';
import {useNumericField} from '@/features/maths/hooks/useNumericField';
import type {MathsScreenProps} from '@/navigation/types';

type PercentMode = 'percentOf' | 'percentRatio' | 'applyChange' | 'variation';
const PERCENT_MODES: PercentMode[] = [
  'percentOf',
  'percentRatio',
  'applyChange',
  'variation',
];

export function PercentScreen(_props: MathsScreenProps<'Percent'>) {
  const {t} = useTranslation();
  const [mode, setMode] = useState<PercentMode>('percentOf');
  const fields = {
    x: useNumericField(),
    y: useNumericField(),
    z: useNumericField(),
  };
  const X = fields.x.value;
  const Y = fields.y.value;
  const Z = fields.z.value;

  let result: number | undefined;
  switch (mode) {
    case 'percentOf':
      if (X !== undefined && Y !== undefined) result = percentOf(X, Y);
      break;
    case 'percentRatio':
      if (X !== undefined && Y !== undefined && Y !== 0)
        result = percentRatio(X, Y);
      break;
    case 'applyChange':
      if (X !== undefined && Y !== undefined) result = applyPercentChange(Y, X);
      break;
    case 'variation':
      if (Y !== undefined && Z !== undefined && Y !== 0)
        result = percentVariation(Y, Z);
      break;
  }

  // Champs utilisés selon le mode
  const used: ('x' | 'y' | 'z')[] = mode === 'variation' ? ['y', 'z'] : ['x', 'y'];
  const percentInput = (k: 'x' | 'y' | 'z') =>
    k === 'x' && (mode === 'percentOf' || mode === 'applyChange');

  return (
    <ScreenScroll>
      <Chips
        options={PERCENT_MODES.map(m => ({id: m, label: t(`maths.percent.${m}`)}))}
        selected={mode}
        onSelect={id => setMode(id as PercentMode)}
      />
      {used.map(k => (
        <NumField
          key={`${mode}-${k}`}
          label={t(`maths.percent.${k}`)}
          value={fields[k].text}
          onChange={fields[k].setText}
          unit={percentInput(k) ? '%' : undefined}
          signed={k === 'x' && mode === 'applyChange'}
        />
      ))}
      <ResultCard
        label={t('app.result')}
        value={result}
        unit={mode === 'percentRatio' || mode === 'variation' ? '%' : undefined}
      />
      <FormulaBlock
        lines={t('maths.percent.formulas', {returnObjects: true}) as string[]}
      />
    </ScreenScroll>
  );
}
