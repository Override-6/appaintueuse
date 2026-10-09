import type { ComponentRef, RefObject } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme';
import type { Sel } from '@/features/calculator/constants';

// Instance du champ d'expression (pour lui redonner le focus)
export type InputHandle = ComponentRef<typeof TextInput>;

type Props = {
  expr: string;
  sel: Sel;
  echo: string | null;
  big: string;
  onTextChange: (text: string) => void;
  onSelect: (sel: Sel) => void;
  // Permet à l'écran de redonner le focus (donc le curseur) au champ
  inputRef: RefObject<InputHandle | null>;
};

// Écho du calcul, expression éditable et résultat en gros
export function Display({ expr, sel, echo, big, onTextChange, onSelect, inputRef }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  return (
    <View style={[s.display, { backgroundColor: c.card, borderColor: c.border }]}>
      <Text style={[s.echo, { color: c.muted }]} numberOfLines={1}>
        {echo ?? ' '}
      </Text>
      {/* Toute l'expression est visible ; le curseur se place en touchant le texte.
          Le clavier du système reste caché : la saisie passe par le pavé. */}
      <TextInput
        ref={inputRef}
        style={[s.exprInput, { color: c.text }]}
        value={expr}
        selection={sel}
        onSelectionChange={e => onSelect(e.nativeEvent.selection)}
        onChangeText={onTextChange}
        showSoftInputOnFocus={false}
        multiline
        autoFocus
        scrollEnabled
        placeholder="0"
        placeholderTextColor={c.muted}
        accessibilityLabel={t('calculator.expression')}
      />
      <Text
        style={[s.big, { color: c.text }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        selectable
      >
        {big}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  display: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 8 },
  echo: { fontSize: 18, minHeight: 24, textAlign: 'right' },
  exprInput: {
    fontSize: 30,
    fontWeight: '600',
    minHeight: 48,
    maxHeight: 130,
    paddingVertical: 4,
    paddingHorizontal: 0,
    textAlignVertical: 'top',
  },
  big: { fontSize: 44, fontWeight: '700', textAlign: 'right', marginTop: 2 },
});
