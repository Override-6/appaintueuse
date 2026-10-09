import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {MIN_TOUCH, useTheme} from '@/theme';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  /** Affiche le bouton ± : à réserver aux valeurs qui peuvent être négatives */
  signed?: boolean;
};

// Bascule le signe d'une saisie (« 5 » ↔ « -5 »)
export function toggleSign(value: string): string {
  const v = value.trim();
  if (v === '') {
    return '-';
  }
  return v.startsWith('-') ? v.slice(1) : `-${v}`;
}

// Champ numérique : accepte la virgule ; la valeur reste une chaîne (voir parseNumber)
export function NumField({label, value, onChange, unit, signed = false}: Props) {
  const t = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, {color: t.muted}]}>{label}</Text>
      <View
        style={[styles.row, {backgroundColor: t.card, borderColor: t.border}]}>
        <TextInput
          style={[styles.input, {color: t.text}]}
          value={value}
          onChangeText={onChange}
          keyboardType="numbers-and-punctuation"
          inputMode="decimal"
          placeholder="0"
          placeholderTextColor={t.muted}
        />
        {unit ? <Text style={[styles.unit, {color: t.muted}]}>{unit}</Text> : null}
        {/* Le clavier décimal d'Android n'a pas de touche « − » : bouton ± (valeurs signées seulement) */}
        {signed ? (
          <Pressable
            accessibilityLabel="±"
            onPress={() => onChange(toggleSign(value))}
            style={[styles.sign, {backgroundColor: t.key}]}>
            <Text style={[styles.signText, {color: t.text}]}>±</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {marginBottom: 12},
  label: {marginBottom: 4},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: MIN_TOUCH,
  },
  input: {flex: 1, fontSize: 22, paddingVertical: 8},
  unit: {fontSize: 18},
  sign: {
    width: 48,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  signText: {fontSize: 22, fontWeight: '700'},
});
