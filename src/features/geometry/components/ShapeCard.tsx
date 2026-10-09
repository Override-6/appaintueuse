import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {ShapeId} from '../logic/geometry';
import {ShapeDiagram} from './diagrams/ShapeDiagram';

type Props = {shapeId: ShapeId; onPress: () => void};

// Carte de forme du menu : mini-schéma et nom
export function ShapeCard({shapeId, onPress}: Props) {
  const {t} = useTranslation();
  const th = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, {backgroundColor: th.card, borderColor: th.border}]}>
      <View style={styles.thumb}>
        <ShapeDiagram shapeId={shapeId} width={96} />
      </View>
      <Text style={[styles.title, {color: th.text}]}>
        {t(`geometry.shapes.${shapeId}`)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  thumb: {marginRight: 12},
  title: {fontSize: 18, fontWeight: '600', flexShrink: 1},
});
