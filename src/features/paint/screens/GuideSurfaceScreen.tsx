import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, ResultCard, ScreenScroll} from '@/components';
import {PendingDrafts} from '@/features/paint/components/PendingDrafts';
import {PieceRow} from '@/features/paint/components/PieceRow';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import {totalAreaDm2} from '@/features/paint/logic/plan';
import type {PaintScreenProps} from '@/navigation/types';
import {useTheme} from '@/theme';

// Étape 1 : liste des pièces à peindre, surface totale et accès aux étapes suivantes
export function GuideSurfaceScreen({navigation}: PaintScreenProps<'GuideSurface'>) {
  const {t} = useTranslation();
  const th = useTheme();
  const {pieces, setCount, removePiece} = usePaintPlan();

  return (
    <ScreenScroll>
      <PendingDrafts
        onResumeShape={shapeId => navigation.navigate('GuideDimensions', {shapeId})}
        onResumeKnown={() => navigation.navigate('GuideKnownSurface')}
      />
      {pieces.length === 0 ? (
        <Text style={[styles.empty, {color: th.muted}]}>{t('paint.guide.surface.empty')}</Text>
      ) : null}
      {pieces.map((piece, i) => (
        <PieceRow
          key={i}
          piece={piece}
          onCount={n => setCount(i, n)}
          onRemove={() => removePiece(i)}
        />
      ))}
      {pieces.length > 0 ? (
        <ResultCard label={t('paint.guide.surface.total')} value={totalAreaDm2(pieces)} unit="dm²" />
      ) : null}
      <Button label={t('paint.guide.surface.addShape')} secondary onPress={() => navigation.navigate('GuideShape')} />
      <Button
        label={t('paint.guide.surface.addKnown')}
        secondary
        onPress={() => navigation.navigate('GuideKnownSurface')}
      />
      {pieces.length > 0 ? (
        <Button label={t('paint.guide.surface.next')} onPress={() => navigation.navigate('GuideProduct')} />
      ) : null}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  empty: {fontSize: 18, marginBottom: 12},
});
