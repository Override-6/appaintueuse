import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Chips, NumField} from '@/components';
import {useTheme} from '@/theme';
import type {AreaUnit} from '../logic/rate';
import type {RateDraft, RateMode} from '../logic/persist';

type Props = {
  draft: RateDraft;
  set: <K extends keyof RateDraft>(key: K, value: RateDraft[K]) => void;
};

// Saisie du rendement : « m² par litre » (par défaut) ou « mL de peinture couvrent une surface »
export function RateForm({draft, set}: Props) {
  const {t} = useTranslation();
  const th = useTheme();
  const modes = [
    {id: 'area', label: t('paint.guide.product.modeArea')},
    {id: 'ml', label: t('paint.guide.product.modeMl')},
  ];
  const units = [
    {id: 'm2', label: t('paint.units.m2')},
    {id: 'dm2', label: t('paint.units.dm2')},
  ];

  return (
    <>
      <Chips options={modes} selected={draft.mode} onSelect={id => set('mode', id as RateMode)} />
      {draft.mode === 'area' ? (
        <NumField
          label={t('paint.guide.product.areaPerLiter')}
          value={draft.area}
          onChange={v => set('area', v)}
          unit={t('paint.units.m2PerL')}
        />
      ) : (
        <>
          <Text style={[styles.sentence, {color: th.muted}]}>{t('paint.guide.product.mlSentence')}</Text>
          <NumField
            label={t('paint.guide.product.ml')}
            value={draft.ml}
            onChange={v => set('ml', v)}
            unit="mL"
          />
          <NumField
            label={t('paint.guide.product.mlArea')}
            value={draft.mlArea}
            onChange={v => set('mlArea', v)}
          />
          <Chips
            options={units}
            selected={draft.mlUnit}
            onSelect={id => set('mlUnit', id as AreaUnit)}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sentence: {fontSize: 16, marginBottom: 8},
});
