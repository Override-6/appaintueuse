import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {useTheme} from '@/theme';

type Props = {
  options: {id: string; label: string}[];
  selected: string;
  onSelect: (id: string) => void;
};

// Rangée de puces à choix unique (formes, grandeurs, unités…)
export function Chips({options, selected, onSelect}: Props) {
  const t = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}>
      {options.map(o => {
        const on = o.id === selected;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{selected: on}}
            onPress={() => onSelect(o.id)}
            style={[styles.chip, {backgroundColor: on ? t.primary : t.key}]}>
            <Text style={[styles.label, {color: on ? t.onPrimary : t.text}]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {marginBottom: 12},
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {fontSize: 16},
});
