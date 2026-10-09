import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StepList, isClose, type Step} from '@/features/learning';
import {MIN_TOUCH, useTheme} from '@/theme';
import {formatLiters, formatMl, sumOf} from '../logic/mix';

type Props = {names: string[]; amounts: number[]; total: number; steps: Step[]};

// Quantités de chaque produit (L et mL), vérification du total puis étapes
export function MixResults({names, amounts, total, steps}: Props) {
  const t = useTheme();
  const {t: tr} = useTranslation();
  const back = sumOf(amounts);
  const ok = isClose(back, total);

  return (
    <View>
      <Text style={[styles.title, {color: t.text}]}>{tr('mix.quantities')}</Text>
      {names.map((name, i) => (
        <View key={`q${i}`} style={[styles.card, {backgroundColor: t.card, borderColor: t.primary}]}>
          <Text style={[styles.name, {color: t.muted}]}>{name}</Text>
          <Text style={[styles.value, {color: t.text}]} selectable>
            {tr('mix.liters', {value: formatLiters(amounts[i])})}
          </Text>
          <Text style={[styles.sub, {color: t.muted}]} selectable>
            {tr('mix.milliliters', {value: formatMl(amounts[i])})}
          </Text>
        </View>
      ))}
      <Text style={[styles.check, {color: ok ? t.primary : t.muted}]}>
        {ok
          ? tr('mix.checkOk', {total: formatLiters(total)})
          : tr('mix.checkKo')}
      </Text>
      <Text style={[styles.title, {color: t.text}]}>{tr('mix.steps')}</Text>
      <Text style={[styles.hint, {color: t.muted}]}>{tr('mix.stepsHint')}</Text>
      <StepList steps={steps} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 18, fontWeight: '600', marginBottom: 8, marginTop: 4},
  hint: {marginBottom: 8},
  card: {
    minHeight: MIN_TOUCH,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  name: {fontSize: 16},
  value: {fontSize: 26, fontWeight: '700', marginTop: 2},
  sub: {fontSize: 17, marginTop: 2},
  check: {fontSize: 16, fontWeight: '600', marginBottom: 12},
});
