import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, ErrorText, ResultCard, ScreenScroll} from '@/components';
import {PracticeGate, PracticeToggle, usePractice} from '@/features/learning';
import {useTheme} from '@/theme';
import type {GeometryScreenProps} from '@/navigation/types';
import {DimensionForm} from '../components/DimensionForm';
import {Formulas} from '../components/Formulas';
import {PartsPicker} from '../components/PartsPicker';
import {ShapeDiagram} from '../components/diagrams/ShapeDiagram';
import {StepsList} from '../components/StepsList';
import {readInputs, inputError} from '../logic/shapeInputs';
import {SURFACE_SHAPES, areaUnit, paintedArea} from '../logic/surfaces';
import type {SurfaceShape, Unit} from '../logic/surfaces';
import {areaSteps} from '../logic/surfaceSteps';

const ERROR_KEYS = {
  negative: 'geometry.negative',
  invalidRing: 'geometry.invalidRing',
  invalidCone: 'geometry.invalidCone',
} as const;

// Forme choisie : schéma, champs, faces à peindre, surface (dans l'unité choisie) et étapes
export function ShapeScreen({route}: GeometryScreenProps<'Shape'>) {
  const shape = SURFACE_SHAPES.find(s => s.id === route.params.shapeId);
  if (!shape) return null;
  return <ShapeForm key={shape.id} shape={shape} />;
}

function ShapeForm({shape}: {shape: SurfaceShape}) {
  const {t} = useTranslation();
  const th = useTheme();
  const {enabled: practice} = usePractice();
  const [unit, setUnit] = useState<Unit>('cm');
  const [vals, setVals] = useState<Record<string, string>>({});
  const [parts, setParts] = useState<string[]>(() => shape.parts.map(p => p.id));

  // Entrée absente ou invalide = NaN : pas de résultat
  const nums = readInputs(shape.dimensions, vals);
  const err = inputError(shape.id, nums);
  const area = paintedArea(shape.id, nums, parts);
  const steps = areaSteps(shape.id, nums, unit, parts);
  // Une figure plane n'a qu'une face : le schéma la montre toujours peinte
  const shown = shape.kind === '2d' ? ['face'] : parts;

  return (
    <ScreenScroll>
      <PracticeToggle />
      <ShapeDiagram shapeId={shape.id} selectedParts={shown} values={vals} unit={unit} showAreas={!practice} />
      <Text style={[styles.same, {color: th.muted}]}>{t('geometry.sameThing')}</Text>
      <DimensionForm
        shapeId={shape.id}
        unit={unit}
        values={vals}
        onUnit={setUnit}
        onChange={(dim, v) => setVals(p => ({...p, [dim]: v}))}
      />
      {shape.kind === '3d' ? (
        <PartsPicker shapeId={shape.id} selected={parts} onChange={setParts} />
      ) : null}
      {err ? <ErrorText>{t(ERROR_KEYS[err])}</ErrorText> : null}
      <PracticeGate answer={area}>
        <ResultCard
          label={t('geometry.paint.result')}
          value={area}
          unit={areaUnit(unit)}
        />
        {steps.length > 0 ? (
          <View style={styles.steps}>
            <Text style={[styles.stepsTitle, {color: th.text}]}>
              {t('geometry.paint.steps')}
            </Text>
            <Text style={[styles.hint, {color: th.muted}]}>{t('geometry.paint.stepsHint')}</Text>
            <StepsList steps={steps} />
          </View>
        ) : null}
      </PracticeGate>
      <Button label={t('app.reset')} secondary onPress={() => setVals({})} />
      <Formulas formulaKey={`geometry.formulas.${shape.id}`} />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  same: {marginBottom: 12},
  steps: {marginBottom: 12},
  stepsTitle: {fontSize: 18, fontWeight: '600', marginBottom: 4},
  hint: {marginBottom: 8},
});
