import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components';
import {MIN_TOUCH, useTheme} from '@/theme';
import {formatNumber} from '@/utils/format';
import type {PlanPiece} from '../logic/plan';

type Props = {
  piece: PlanPiece;
  onCount: (count: number) => void;
  onRemove: () => void;
};

// Une pièce de la liste : nom, « surface × exemplaires = sous-total », puis − / + et supprimer
export function PieceRow({piece, onCount, onRemove}: Props) {
  const {t} = useTranslation();
  const th = useTheme();
  const name = piece.shapeId ? t(`geometry.shapes.${piece.shapeId}`) : t('paint.guide.surface.known');
  const sub = piece.areaDm2 * piece.count;

  return (
    <View style={[styles.card, {backgroundColor: th.card, borderColor: th.border}]}>
      <Text style={[styles.name, {color: th.text}]}>{name}</Text>
      <Text style={[styles.line, {color: th.text}]}>
        {t('paint.guide.surface.line', {
          area: formatNumber(piece.areaDm2),
          count: formatNumber(piece.count),
          sub: formatNumber(sub),
        })}
      </Text>
      <View style={styles.counter}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('paint.guide.surface.less')}
          disabled={piece.count <= 1}
          onPress={() => onCount(piece.count - 1)}
          style={[styles.step, {backgroundColor: th.key}, piece.count <= 1 ? styles.off : null]}>
          <Text style={[styles.stepText, {color: th.text}]}>−</Text>
        </Pressable>
        <Text style={[styles.count, {color: th.text}]}>{piece.count}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('paint.guide.surface.more')}
          onPress={() => onCount(piece.count + 1)}
          style={[styles.step, {backgroundColor: th.key}]}>
          <Text style={[styles.stepText, {color: th.text}]}>+</Text>
        </Pressable>
      </View>
      <Button label={t('paint.guide.surface.remove')} secondary onPress={onRemove} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12},
  name: {fontSize: 18, fontWeight: '600'},
  line: {fontSize: 18, marginTop: 4, marginBottom: 12},
  counter: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  step: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {fontSize: 26, fontWeight: '700'},
  count: {minWidth: 56, textAlign: 'center', fontSize: 22, fontWeight: '700'},
  off: {opacity: 0.4},
});
