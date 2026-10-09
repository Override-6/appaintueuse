import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components';
import {MIN_TOUCH, useTheme} from '@/theme';
import {MAX_PARTS, MAX_PART_VALUE, MIN_PARTS} from '../logic/mix';

type Props = {parts: number[]; onChange: (parts: number[]) => void};

type StepProps = {label: string; a11y: string; onPress: () => void; disabled?: boolean};

// Bouton carré de grande taille (− / + / ×)
function StepButton({label, a11y, onPress, disabled}: StepProps) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{disabled: !!disabled}}
      disabled={disabled}
      onPress={onPress}
      style={[styles.step, {backgroundColor: t.key}, disabled ? styles.disabled : null]}>
      <Text style={[styles.stepText, {color: t.text}]}>{label}</Text>
    </Pressable>
  );
}

// Liste des composants : ± pour les parts, ajout et retrait (2 à 6 composants)
export function PartsEditor({parts, onChange}: Props) {
  const t = useTheme();
  const {t: tr} = useTranslation();

  const setPart = (i: number, value: number) =>
    onChange(parts.map((p, k) => (k === i ? value : p)));
  const removeAt = (i: number) => onChange(parts.filter((_, k) => k !== i));

  return (
    <View>
      {parts.map((p, i) => {
        const n = i + 1;
        return (
          <View key={`c${i}`} style={[styles.row, {backgroundColor: t.card, borderColor: t.border}]}>
            <Text style={[styles.name, {color: t.text}]} numberOfLines={1}>
              {tr('mix.component', {n})}
            </Text>
            <StepButton
              label="−"
              a11y={tr('mix.decrease', {n})}
              disabled={p <= 1}
              onPress={() => setPart(i, Math.max(1, p - 1))}
            />
            <Text style={[styles.count, {color: t.text}]}>{p}</Text>
            <StepButton
              label="+"
              a11y={tr('mix.increase', {n})}
              disabled={p >= MAX_PART_VALUE}
              onPress={() => setPart(i, Math.min(MAX_PART_VALUE, p + 1))}
            />
            {parts.length > MIN_PARTS ? (
              <StepButton label="×" a11y={tr('mix.remove', {n})} onPress={() => removeAt(i)} />
            ) : null}
          </View>
        );
      })}
      {parts.length < MAX_PARTS ? (
        <Button label={tr('mix.addPart')} secondary onPress={() => onChange([...parts, 1])} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 12,
    paddingRight: 6,
    marginBottom: 8,
  },
  name: {flex: 1, fontSize: 17, marginRight: 4},
  count: {minWidth: 36, textAlign: 'center', fontSize: 22, fontWeight: '700'},
  step: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  stepText: {fontSize: 24, fontWeight: '700'},
  disabled: {opacity: 0.4},
});
