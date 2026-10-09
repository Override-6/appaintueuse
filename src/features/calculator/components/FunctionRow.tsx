import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MIN_TOUCH, useTheme } from '@/theme';
import { FUNCS, FuncId } from '@/features/calculator/constants';

type Props = {
  fracView: boolean;
  onFunc: (id: FuncId) => void;
};

// Bouton « Fonctions » qui déplie la rangée de fonctions
export function FunctionRow({ fracView, onFunc }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  const [open, setOpen] = useState(false);

  // Libellé affiché d'une fonction
  const labelOf = (id: FuncId): string => {
    switch (id) {
      case 'fracToDec':
        return t('calculator.fracToDec');
      case 'decToFrac':
        return t('calculator.decToFrac');
      case 'space':
        return '␣';
      default:
        return id;
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(o => !o)}
        style={[s.moreBtn, { backgroundColor: c.key, borderColor: c.border }]}
      >
        <Text style={[s.moreText, { color: c.text }]}>
          {t('calculator.more')} {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.funcRow}
        >
          {FUNCS.map(id => {
            // État actif : fond primaire et coche, pour ne pas dépendre de la seule couleur
            const active = id === 'decToFrac' && fracView;
            const base = labelOf(id);
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onFunc(id)}
                style={[s.funcBtn, { backgroundColor: active ? c.primary : c.key }]}
              >
                <Text style={[s.funcText, { color: active ? c.onPrimary : c.text }]}>
                  {active ? `✓ ${base}` : base}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </>
  );
}

const s = StyleSheet.create({
  moreBtn: {
    minHeight: MIN_TOUCH,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  moreText: { fontSize: 18, fontWeight: '600' },
  funcRow: { marginBottom: 6, flexGrow: 0 },
  funcBtn: {
    minHeight: MIN_TOUCH,
    paddingHorizontal: 18,
    borderRadius: 14,
    justifyContent: 'center',
    marginRight: 8,
  },
  funcText: { fontSize: 18, fontWeight: '600' },
});
