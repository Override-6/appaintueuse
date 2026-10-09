import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Step} from '../logic/calcSteps';

// Étapes numérotées : une petite opération par ligne
export function StepsList({steps}: {steps: Step[]}) {
  const {t} = useTranslation();
  const th = useTheme();
  return (
    <View>
      {steps.map((s, i) => (
        <View key={`${i}-${s.key}`} style={styles.row}>
          <Text style={[styles.num, {color: th.primary}]}>{i + 1}.</Text>
          <Text style={[styles.text, {color: th.text}]}>{t(s.key, s.params)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', marginBottom: 8},
  num: {width: 28, fontSize: 18, fontWeight: '700'},
  text: {flex: 1, fontSize: 18},
});
