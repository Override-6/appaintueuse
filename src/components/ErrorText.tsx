import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from '@/theme';

// Message d'erreur ou de validation, couleur issue du thème
export function ErrorText({children}: {children: string}) {
  const t = useTheme();
  return <Text style={[styles.text, {color: t.danger}]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {fontSize: 16, marginBottom: 12},
});
