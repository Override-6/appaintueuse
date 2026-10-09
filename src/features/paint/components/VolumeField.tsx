import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NumField} from '@/components';
import {MIN_TOUCH, useTheme} from '@/theme';
import type {VolumeUnit} from '../logic/mix';

type Props = {
  value: string;
  unit: VolumeUnit;
  onChange: (value: string) => void;
  onUnitChange: (unit: VolumeUnit) => void;
};

const UNITS: VolumeUnit[] = ['L', 'mL'];

// Quantité totale avec choix de l'unité (litres ou mL)
export function VolumeField({value, unit, onChange, onUnitChange}: Props) {
  const t = useTheme();
  const {t: tr} = useTranslation();
  return (
    <View>
      <NumField label={tr('mix.total')} value={value} onChange={onChange} unit={unit} />
      <View style={styles.toggle}>
        {UNITS.map(u => {
          const on = u === unit;
          return (
            <Pressable
              key={u}
              accessibilityRole="button"
              accessibilityState={{selected: on}}
              onPress={() => onUnitChange(u)}
              style={[styles.option, {backgroundColor: on ? t.primary : t.key}]}>
              <Text style={[styles.optionText, {color: on ? t.onPrimary : t.text}]}>{u}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {flexDirection: 'row', marginBottom: 12},
  option: {
    minWidth: 88,
    minHeight: MIN_TOUCH,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 16,
  },
  optionText: {fontSize: 18, fontWeight: '600'},
});
