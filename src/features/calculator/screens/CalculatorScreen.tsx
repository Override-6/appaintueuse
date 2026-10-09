import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { RootTabScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useCalculator } from '@/features/calculator/hooks/useCalculator';
import { Display, type InputHandle } from '@/features/calculator/components/Display';
import { FunctionRow } from '@/features/calculator/components/FunctionRow';
import { History } from '@/features/calculator/components/History';
import { Keypad } from '@/features/calculator/components/Keypad';

// Écran de la calculatrice : compose les composants, la logique est dans le hook
export function CalculatorScreen({ route, navigation }: RootTabScreenProps<'Calculator'>) {
  const c = useTheme();
  const calc = useCalculator(route.params);
  const inputRef = useRef<InputHandle>(null);

  // À chaque retour sur l'onglet (ex. via le raccourci d'un résultat), le champ reprend
  // le focus : sans ça le curseur n'apparaît que la toute première fois (autoFocus)
  useEffect(
    () => navigation.addListener?.('focus', () => inputRef.current?.focus()),
    [navigation],
  );
  return (
    <View style={[s.root, { backgroundColor: c.bg }]}>
      <Display
        expr={calc.expr}
        sel={calc.sel}
        echo={calc.echo}
        big={calc.big}
        onTextChange={calc.onTextChange}
        onSelect={calc.onSelect}
        inputRef={inputRef}
      />

      <History
        history={calc.history}
        fracView={calc.fracView}
        onReuse={calc.onReuse}
      />

      {/* Bas de l'écran : borné en hauteur et défilable, l'historique garde sa hauteur minimale */}
      <ScrollView
        style={s.controls}
        contentContainerStyle={s.controlsContent}
        showsVerticalScrollIndicator={false}
      >
        <FunctionRow fracView={calc.fracView} onFunc={calc.onFunc} />
        <Keypad onKey={calc.onKey} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, padding: 12, paddingBottom: 16 },
  controls: { flexGrow: 0, flexShrink: 1, maxHeight: '60%' },
  controlsContent: { flexGrow: 0 },
});
