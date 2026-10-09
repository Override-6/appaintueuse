import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, ErrorText, NumField, ResultCard, ScreenScroll} from '@/components';
import {DimensionForm, PartsPicker, ShapeDiagram, areaUnit} from '@/features/geometry';
import {StepList} from '@/features/learning';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import {useShapeDraft} from '@/features/paint/hooks/useShapeDraft';
import type {PaintScreenProps} from '@/navigation/types';
import {useTheme} from '@/theme';

// Étape « Ajouter une forme » : schéma, mesures, parties à peindre (solides), exemplaires et surface
export function GuideDimensionsScreen({route, navigation}: PaintScreenProps<'GuideDimensions'>) {
  const {t} = useTranslation();
  const th = useTheme();
  const {addPiece, clearShapeDraft} = usePaintPlan();
  const draft = useShapeDraft(route.params.shapeId);
  const {shape} = draft;
  // Une figure plane n'a qu'une partie : le schéma la montre toujours peinte
  const shown = shape.kind === '2d' ? ['face'] : draft.parts;

  const add = () => {
    if (draft.piece) {
      addPiece(draft.piece);
      clearShapeDraft();
      navigation.popTo('GuideSurface');
    }
  };

  return (
    <ScreenScroll>
      <ShapeDiagram
        shapeId={shape.id}
        selectedParts={shown}
        values={draft.vals}
        unit={draft.unit}
      />
      <Text style={[styles.same, {color: th.muted}]}>{t('geometry.sameThing')}</Text>
      <DimensionForm
        shapeId={shape.id}
        unit={draft.unit}
        values={draft.vals}
        onUnit={draft.setUnit}
        onChange={draft.setVal}
      />
      {shape.kind === '3d' ? (
        <PartsPicker shapeId={shape.id} selected={draft.parts} onChange={draft.setParts} />
      ) : (
        <Text style={[styles.same, {color: th.muted}]}>{t('paint.guide.dimensions.flat')}</Text>
      )}
      {draft.message ? <ErrorText>{t(draft.message)}</ErrorText> : null}
      <ResultCard
        label={t('geometry.paint.result')}
        value={draft.area}
        unit={areaUnit(draft.unit)}
      />
      {draft.steps.length > 0 ? (
        <>
          <Text style={[styles.title, {color: th.text}]}>{t('geometry.paint.steps')}</Text>
          <StepList steps={draft.steps} />
        </>
      ) : null}
      {/* La suite du parcours calcule en dm² : on montre le passage, avec les chiffres de la peintre */}
      {draft.dm2Steps.length > 0 ? (
        <>
          <Text style={[styles.title, {color: th.text}]}>{t('paint.guide.dimensions.toDm2')}</Text>
          <StepList steps={draft.dm2Steps} />
        </>
      ) : null}
      <NumField
        label={t('paint.guide.count.label')}
        value={draft.countText}
        onChange={draft.setCountText}
      />
      <Text style={[styles.same, {color: th.muted}]}>{t('paint.guide.count.hint')}</Text>
      {draft.countValid ? null : <ErrorText>{t('paint.guide.count.invalid')}</ErrorText>}
      <Button label={t('paint.guide.dimensions.add')} onPress={add} />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  same: {marginBottom: 12},
  title: {fontSize: 18, fontWeight: '600', marginBottom: 8},
});
