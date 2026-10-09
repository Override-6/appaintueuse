import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {useTheme} from '@/theme';

type Props = {title: string; subtitle?: string; onPress: () => void};

// Carte d'outil pour les listes (titre + sous-titre)
export function ToolCard({title, subtitle, onPress}: Props) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, {backgroundColor: t.card, borderColor: t.border}]}>
      <Text style={[styles.title, {color: t.text}]}>{title}</Text>
      {subtitle ? <Text style={{color: t.muted}}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12},
  title: {fontSize: 18, fontWeight: '600'},
});
