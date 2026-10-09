import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScreenScroll, ToolCard} from '@/components';
import {useTheme} from '@/theme';
import type {GeometryScreenProps} from '@/navigation/types';
import {ShapeCard} from '../components/ShapeCard';
import {SURFACE_SHAPES} from '../logic/surfaces';

// Menu : formes planes, solides, puis formules, surface composée et échelle
export function GeometryMenuScreen({
  navigation,
}: GeometryScreenProps<'GeometryMenu'>) {
  const {t} = useTranslation();
  const th = useTheme();
  const section = (label: string) => (
    <Text style={[styles.section, {color: th.muted}]}>{label}</Text>
  );
  const shapesOf = (kind: '2d' | '3d') =>
    SURFACE_SHAPES.filter(s => s.kind === kind).map(s => (
      <ShapeCard
        key={s.id}
        shapeId={s.id}
        onPress={() => navigation.navigate('Shape', {shapeId: s.id})}
      />
    ));
  return (
    <ScreenScroll>
      {section(t('geometry.kinds.flat'))}
      {shapesOf('2d')}
      {section(t('geometry.kinds.solid'))}
      {shapesOf('3d')}
      <ToolCard
        title={t('geometry.menu.formulas')}
        onPress={() => navigation.navigate('Formulas')}
      />
      <ToolCard
        title={t('geometry.composed.title')}
        onPress={() => navigation.navigate('Composed')}
      />
      <ToolCard
        title={t('geometry.scale.title')}
        onPress={() => navigation.navigate('Scale')}
      />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  section: {fontSize: 16, marginBottom: 8, marginTop: 4},
});
