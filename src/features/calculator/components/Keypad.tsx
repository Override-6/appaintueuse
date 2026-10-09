import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MIN_TOUCH, Theme, useTheme } from '@/theme';
import {
  BACK_RED,
  CLEAR_RED,
  KeyDef,
  ROWS,
} from '@/features/calculator/constants';

type Props = {
  onKey: (k: string) => void;
};

type KeyColors = { bg: string; fg: string; border: string };

// Couleurs d'une touche : C et ⌫ en rouge, opérateurs à bordure primaire
const colorsOf = (key: KeyDef, c: Theme): KeyColors => {
  if (key.kind === 'clear') {
    return { bg: CLEAR_RED, fg: '#ffffff', border: CLEAR_RED };
  }
  if (key.kind === 'back') {
    return { bg: BACK_RED, fg: '#111827', border: BACK_RED };
  }
  if (key.kind === 'op') {
    return { bg: c.card, fg: c.text, border: c.primary };
  }
  return { bg: c.key, fg: c.text, border: c.border };
};

type KeyButtonProps = {
  label: string;
  onPress: () => void;
  colors: KeyColors;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

// Touche du pavé : fond et bordure selon la couleur, estompée à l'appui
function KeyButton({ label, onPress, colors, style, textStyle }: KeyButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        s.key,
        style,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Text style={[s.keyText, textStyle, { color: colors.fg }]}>{label}</Text>
    </Pressable>
  );
}

// Pavé numérique et opérateurs, avec la touche « = »
export function Keypad({ onKey }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  const numColors = { bg: c.key, fg: c.text, border: c.border };
  return (
    <View>
      {ROWS.map((row, r) => (
        <View key={r} style={s.keyRow}>
          {row.map(key => (
            <KeyButton
              key={key.k}
              label={key.kind === 'clear' ? t('calculator.clear') : key.k}
              onPress={() => onKey(key.k)}
              colors={colorsOf(key, c)}
            />
          ))}
        </View>
      ))}
      <View style={s.keyRow}>
        {['0', ','].map(k => (
          <KeyButton
            key={k}
            label={k}
            onPress={() => onKey(k)}
            colors={numColors}
          />
        ))}
        <KeyButton
          label="="
          onPress={() => onKey('=')}
          colors={{ bg: c.primary, fg: c.onPrimary, border: c.primary }}
          style={s.equals}
          textStyle={s.equalsText}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  keyRow: { flexDirection: 'row' },
  key: {
    flex: 1,
    minHeight: MIN_TOUCH,
    margin: 3,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 28, fontWeight: '600' },
  // Touche « = » : plus large et plus haute
  equals: { flex: 2, minHeight: 64 },
  equalsText: { fontSize: 32, fontWeight: '700' },
});
