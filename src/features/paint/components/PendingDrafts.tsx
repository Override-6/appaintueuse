import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components';
import {SURFACE_SHAPES, type ShapeId} from '@/features/geometry';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import {
  isKnownDraftFilled,
  isShapeDraftFilled,
  type KnownDraft,
  type ShapeDraft,
} from '@/features/paint/logic/persist';
import {useTheme} from '@/theme';

type Props = {
  onResumeShape: (shapeId: ShapeId) => void;
  onResumeKnown: () => void;
};

// Carte commune : titre, lignes de résumé, Reprendre et Abandonner
function DraftCard({
  title,
  lines,
  onResume,
  onAbandon,
}: {
  title: string;
  lines: string[];
  onResume: () => void;
  onAbandon: () => void;
}) {
  const {t} = useTranslation();
  const th = useTheme();
  return (
    <View style={[styles.card, {backgroundColor: th.card, borderColor: th.primary}]}>
      <Text style={[styles.label, {color: th.muted}]}>{t('paint.guide.draft.title')}</Text>
      <Text style={[styles.name, {color: th.text}]}>{title}</Text>
      {lines.map(line => (
        <Text key={line} style={[styles.line, {color: th.text}]}>
          {line}
        </Text>
      ))}
      <Button label={t('paint.guide.draft.resume')} onPress={onResume} />
      <Button label={t('paint.guide.draft.abandon')} secondary onPress={onAbandon} />
    </View>
  );
}

// Brouillon d'une forme : mesures saisies et nombre d'exemplaires
function ShapeCard({draft, onResume}: {draft: ShapeDraft; onResume: () => void}) {
  const {t} = useTranslation();
  const {clearShapeDraft} = usePaintPlan();
  const shape = SURFACE_SHAPES.find(s => s.id === draft.shapeId)!;
  const measures = shape.dimensions
    .filter(d => (draft.vals[d] ?? '').trim() !== '')
    .map(d => `${t(`geometry.dims.${d}`)} ${draft.vals[d].trim()}`)
    .join(' · ');
  const lines = [
    t('paint.guide.draft.measures', {
      list: measures,
      unit: t(`geometry.units.${draft.unit}`),
    }),
  ];
  if (draft.count.trim() !== '' && draft.count.trim() !== '1') {
    lines.push(t('paint.guide.draft.count', {count: draft.count.trim()}));
  }
  return (
    <DraftCard
      title={t(`geometry.shapes.${draft.shapeId}`)}
      lines={lines}
      onResume={onResume}
      onAbandon={clearShapeDraft}
    />
  );
}

// Brouillon d'une surface connue : valeur saisie et nombre d'exemplaires
function KnownCard({draft, onResume}: {draft: KnownDraft; onResume: () => void}) {
  const {t} = useTranslation();
  const {clearKnownDraft} = usePaintPlan();
  const lines = [
    t('paint.guide.draft.knownValue', {
      value: draft.value.trim(),
      unit: t(`paint.units.${draft.unit}`),
    }),
  ];
  if (draft.count.trim() !== '' && draft.count.trim() !== '1') {
    lines.push(t('paint.guide.draft.count', {count: draft.count.trim()}));
  }
  return (
    <DraftCard
      title={t('paint.guide.surface.known')}
      lines={lines}
      onResume={onResume}
      onAbandon={clearKnownDraft}
    />
  );
}

// Cartes « Pièce en cours » en haut de l'écran pivot, seulement pour un brouillon non vide
export function PendingDrafts({onResumeShape, onResumeKnown}: Props) {
  const {shapeDraft, knownDraft} = usePaintPlan();
  return (
    <>
      {shapeDraft && isShapeDraftFilled(shapeDraft) ? (
        <ShapeCard draft={shapeDraft} onResume={() => onResumeShape(shapeDraft.shapeId)} />
      ) : null}
      {knownDraft && isKnownDraftFilled(knownDraft) ? (
        <KnownCard draft={knownDraft} onResume={onResumeKnown} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: {borderWidth: 2, borderRadius: 14, padding: 16, marginBottom: 16},
  label: {fontSize: 16, marginBottom: 2},
  name: {fontSize: 20, fontWeight: '700', marginBottom: 8},
  line: {fontSize: 18, marginBottom: 4},
});
