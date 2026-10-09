import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Chips, ResultCard} from '@/components';
import {useTheme} from '@/theme';
import {formatNumber} from '@/utils/format';
import {MARGIN_OPTIONS, type PlanResult} from '../logic/plan';
import {formatLiters} from '../logic/mix';

type Props = {result: PlanResult; margin: number; onMargin: (pct: number) => void};

// Réponse en gros (mL arrondis), équivalent en litres, phrase de plausibilité et marge au choix
export function ResultSummary({result, margin, onMargin}: Props) {
  const {t} = useTranslation();
  const th = useTheme();
  const ml = Math.round(result.ml);
  const options = MARGIN_OPTIONS.map(pct => ({
    id: String(pct),
    label: pct === 0 ? t('paint.guide.result.marginNone') : `+${pct} %`,
  }));

  return (
    <>
      <ResultCard label={t('paint.guide.result.title')} value={ml} unit="mL" />
      <Text style={[styles.soit, {color: th.text}]}>
        {t('paint.guide.result.soit', {liters: formatLiters(ml / 1000)})}
      </Text>
      <Text style={[styles.phrase, {color: th.muted}]}>{t(result.quantity.key, result.quantity.params)}</Text>

      <Text style={[styles.title, {color: th.text}]}>{t('paint.guide.result.marginTitle')}</Text>
      <Chips
        options={options}
        selected={String(margin)}
        onSelect={id => onMargin(Number(id))}
      />
      {margin > 0 ? (
        <Text style={[styles.withMargin, {color: th.primary}]}>
          {t('paint.guide.result.withMargin', {ml: formatNumber(Math.round(result.withMarginMl))})}
        </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  soit: {fontSize: 20, fontWeight: '600', marginBottom: 4},
  phrase: {fontSize: 18, marginBottom: 16},
  title: {fontSize: 18, fontWeight: '600', marginBottom: 8},
  withMargin: {fontSize: 22, fontWeight: '700', marginBottom: 12},
});
