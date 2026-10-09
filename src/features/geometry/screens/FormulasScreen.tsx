import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScreenScroll} from '@/components';
import {useTheme} from '@/theme';
import {ShapeDiagram} from '../components/diagrams/ShapeDiagram';
import {SURFACE_SHAPES} from '../logic/surfaces';
import type {ShapeId} from '../logic/geometry';

// Mes formules : une fiche par forme (schéma, formules en mots, rappel aire = surface)
export function FormulasScreen() {
  const {t} = useTranslation();
  return (
    <ScreenScroll>
      <Text style={styles.hint}>{t('geometry.formulasScreen.hint')}</Text>
      {SURFACE_SHAPES.map(s => (
        <FormulaCard key={s.id} shapeId={s.id} />
      ))}
    </ScreenScroll>
  );
}

// Fiche d'une forme
function FormulaCard({shapeId}: {shapeId: ShapeId}) {
  const {t} = useTranslation();
  const th = useTheme();
  const lines = t(`geometry.formulas.${shapeId}`, {returnObjects: true}) as string[];
  return (
    <View style={[styles.card, {backgroundColor: th.card, borderColor: th.border}]}>
      <Text style={[styles.title, {color: th.text}]}>
        {t(`geometry.shapes.${shapeId}`)}
      </Text>
      <View style={styles.center}>
        <ShapeDiagram shapeId={shapeId} width={220} />
      </View>
      {lines.map(line => (
        <Text key={line} style={[styles.line, {color: th.text}]}>
          {line}
        </Text>
      ))}
      <Text style={[styles.same, {color: th.muted}]}>{t('geometry.sameThing')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {fontSize: 16, marginBottom: 12},
  card: {borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 8},
  center: {alignItems: 'center'},
  line: {fontSize: 18, marginBottom: 6},
  same: {fontSize: 15, marginTop: 6},
});
