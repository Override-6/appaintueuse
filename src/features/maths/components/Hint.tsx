import React, {ReactNode} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from '@/theme';

// Texte d'aide discret, sous le titre de l'écran
export function Hint({children}: {children: ReactNode}) {
  const t = useTheme();
  return <Text style={[styles.hint, {color: t.muted}]}>{children}</Text>;
}

const styles = StyleSheet.create({
  hint: {fontSize: 16, marginBottom: 12},
});
