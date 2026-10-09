import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Button,
  ErrorText,
  NumField,
  ResultCard,
  ScreenScroll,
} from '@/components';
import {Formulas} from '../components/Formulas';
import {UnitChips} from '../components/UnitChips';
import {scaleResult} from '../logic/scale';
import type {Unit} from '../logic/surfaces';

// Échelle : réelle, plan et rapport ; le dernier champ saisi pilote le résultat
export function ScaleScreen() {
  const {t} = useTranslation();
  const [unit, setUnit] = useState<Unit>('m');
  const [real, setReal] = useState('');
  const [plan, setPlan] = useState('');
  const [ratio, setRatio] = useState('');
  const [last, setLast] = useState<'real' | 'plan'>('real');

  const {derived, negative} = scaleResult({real, plan, ratio, last});
  const derivedLabel = t(
    last === 'real' ? 'geometry.scale.plan' : 'geometry.scale.real',
  );

  return (
    <ScreenScroll>
      <UnitChips unit={unit} onUnit={setUnit} />
      <NumField
        label={t('geometry.scale.real')}
        unit={unit}
        value={real}
        onChange={v => {
          setReal(v);
          setLast('real');
        }}
      />
      <NumField
        label={t('geometry.scale.plan')}
        unit={unit}
        value={plan}
        onChange={v => {
          setPlan(v);
          setLast('plan');
        }}
      />
      <NumField label={t('geometry.scale.ratio')} value={ratio} onChange={setRatio} />
      <ResultCard label={derivedLabel} value={derived} unit={unit} />
      {negative ? <ErrorText>{t('geometry.negative')}</ErrorText> : null}
      <Button
        label={t('app.reset')}
        secondary
        onPress={() => {
          setReal('');
          setPlan('');
          setRatio('');
        }}
      />
      <Formulas formulaKey="geometry.scale.formulas" />
    </ScreenScroll>
  );
}
