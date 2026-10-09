import React from 'react';
import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FormulaBlock, NumField, ResultCard, ScreenScroll} from '@/components';
import {isInTolerance, toleranceBounds} from '@/features/maths/logic/stats';
import {useNumericField} from '@/features/maths/hooks/useNumericField';
import {useTheme} from '@/theme';
import type {MathsScreenProps} from '@/navigation/types';

// Couleur « conforme » : absente du thème, claire ou sombre selon le mode système
const OK_COLOR = {light: '#15803d', dark: '#4ade80'} as const;

export function ToleranceScreen(_props: MathsScreenProps<'Tolerance'>) {
  const {t} = useTranslation();
  const theme = useTheme();
  const dark = useColorScheme() === 'dark';

  const nominal = useNumericField();
  const plusMinus = useNumericField();
  const measured = useNumericField();
  const N = nominal.value;
  const E = plusMinus.value;
  const M = measured.value;

  const bounds =
    N !== undefined && E !== undefined ? toleranceBounds(N, E) : undefined;
  const verdict =
    bounds !== undefined && M !== undefined
      ? isInTolerance(M, bounds)
      : undefined;
  const verdictColor =
    verdict === undefined
      ? theme.muted
      : verdict
      ? (dark ? OK_COLOR.dark : OK_COLOR.light)
      : theme.danger;

  return (
    <ScreenScroll>
      <NumField
        label={t('maths.measures.tolerance.nominal')}
        value={nominal.text}
        onChange={nominal.setText}
      />
      <NumField
        label={t('maths.measures.tolerance.plusMinus')}
        value={plusMinus.text}
        onChange={plusMinus.setText}
      />
      <NumField
        label={t('maths.measures.tolerance.measured')}
        value={measured.text}
        onChange={measured.setText}
      />
      <ResultCard label={t('maths.measures.tolerance.min')} value={bounds?.min} />
      <ResultCard label={t('maths.measures.tolerance.max')} value={bounds?.max} />
      <View style={[styles.verdict, {backgroundColor: theme.card, borderColor: verdictColor}]}>
        <Text style={[styles.verdictText, {color: verdictColor}]}>
          {verdict === undefined
            ? '?'
            : verdict
            ? t('maths.measures.tolerance.ok')
            : t('maths.measures.tolerance.ko')}
        </Text>
      </View>
      <FormulaBlock
        lines={t('maths.measures.tolerance.formulas', {returnObjects: true}) as string[]}
      />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  verdict: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  verdictText: {fontSize: 26, fontWeight: '700'},
});
