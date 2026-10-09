import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Calculator} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {useOpenInCalculator} from '@/navigation/useOpenInCalculator';
import {MIN_TOUCH, useTheme} from '@/theme';
import {formatNumber} from '@/utils/format';

type Props = {
  label: string;
  value: number | string | undefined;
  unit?: string;
};

// Résultat en gros ; « ? » quand il n'est pas disponible.
// Un résultat numérique a une icône calculatrice qui l'ouvre dans l'onglet Calculatrice.
export function ResultCard({label, value, unit}: Props) {
  const t = useTheme();
  const openInCalculator = useOpenInCalculator();
  const {t: tr} = useTranslation();
  const text = typeof value === 'number' ? formatNumber(value) : value ?? '?';
  return (
    <View
      style={[styles.card, {backgroundColor: t.card, borderColor: t.primary}]}>
      <View style={styles.head}>
        <Text style={[styles.label, {color: t.muted}]}>{label}</Text>
        {typeof value === 'number' && Number.isFinite(value) && openInCalculator ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tr('app.openInCalculator')}
            onPress={() => openInCalculator(value)}
            style={[styles.calc, {backgroundColor: t.key}]}>
            <Calculator color={t.primary} size={24} />
          </Pressable>
        ) : null}
      </View>
      <Text style={[styles.value, {color: t.text}]} selectable>
        {text}
        {unit ? <Text style={[styles.unit, {color: t.muted}]}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12},
  head: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  label: {flex: 1},
  calc: {
    width: MIN_TOUCH - 8,
    height: MIN_TOUCH - 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {fontSize: 34, fontWeight: '700', marginTop: 4},
  unit: {fontSize: 20},
});
