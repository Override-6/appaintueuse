import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ShapeDiagram, type ShapeId} from '@/features/geometry';
import {useTheme} from '@/theme';

type Props = {shapeId: ShapeId; onPress: () => void};

// Tuile de la grille : mini-schéma et nom de la forme
export function ShapeTile({shapeId, onPress}: Props) {
  const {t} = useTranslation();
  const th = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.tile, {backgroundColor: th.card, borderColor: th.border}]}>
      <ShapeDiagram shapeId={shapeId} width={120} />
      <Text style={[styles.name, {color: th.text}]}>{t(`geometry.shapes.${shapeId}`)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {fontSize: 17, fontWeight: '600', textAlign: 'center'},
});
