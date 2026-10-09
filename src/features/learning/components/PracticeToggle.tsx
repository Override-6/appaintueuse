import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MIN_TOUCH, useTheme} from '@/theme';
import {usePractice} from '../context/PracticeContext';
import {LK} from '../keys';

// Ligne « À toi d'essayer » : libellé + interrupteur
export function PracticeToggle() {
  const t = useTheme();
  const {t: tr} = useTranslation();
  const {enabled, setEnabled} = usePractice();
  return (
    <View style={[styles.row, {backgroundColor: t.card, borderColor: t.border}]}>
      <Text style={[styles.label, {color: t.text}]}>{tr(LK.practiceToggle)}</Text>
      <Switch
        value={enabled}
        onValueChange={setEnabled}
        trackColor={{false: t.key, true: t.primary}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  label: {flex: 1, fontSize: 18, marginRight: 12},
});
