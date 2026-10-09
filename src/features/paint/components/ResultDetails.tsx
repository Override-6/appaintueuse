import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CrossTable, StepList} from '@/features/learning';
import {useTheme} from '@/theme';
import {formatNumber} from '@/utils/format';
import type {PlanResult} from '../logic/plan';

type Props = {result: PlanResult; rateDm2PerL: number};

// Détail du calcul : surface totale, puis produit en croix dm² ↔ litres
export function ResultDetails({result, rateDm2PerL}: Props) {
  const {t} = useTranslation();
  const th = useTheme();
  return (
    <View>
      <Text style={[styles.title, {color: th.text}]}>{t('paint.guide.result.totalTitle')}</Text>
      <StepList steps={result.totalSteps} />

      <Text style={[styles.title, {color: th.text}]}>{t('paint.guide.result.crossTitle')}</Text>
      <CrossTable
        headers={[t('paint.guide.result.surface'), t('paint.guide.result.liters')]}
        knownLabel={t('paint.guide.result.known')}
        known={[formatNumber(rateDm2PerL), '1']}
        soughtLabel={t('paint.guide.result.sought')}
        sought={[formatNumber(result.total), '?']}
      />
      <StepList steps={result.cross.steps} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 18, fontWeight: '600', marginBottom: 8, marginTop: 4},
});
