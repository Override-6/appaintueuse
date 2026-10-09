import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Step} from '../logic/steps';

// Étapes numérotées : chaque étape est une phrase traduite
export function StepList({steps}: {steps: Step[]}) {
  const t = useTheme();
  const {t: tr} = useTranslation();
  return (
    <View>
      {steps.map((s, i) => (
        <View key={`${i}-${s.key}`} style={styles.row}>
          <View style={[styles.badge, {backgroundColor: t.primary}]}>
            <Text style={[styles.badgeText, {color: t.onPrimary}]}>{i + 1}</Text>
          </View>
          <Text style={[styles.text, {color: t.text}]}>{tr(s.key, s.params)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12},
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeText: {fontSize: 15, fontWeight: '700'},
  text: {flex: 1, fontSize: 18, lineHeight: 26},
});
