import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScreenScroll} from '@/components';
import {SURFACE_SHAPES} from '@/features/geometry';
import {ShapeTile} from '@/features/paint/components/ShapeTile';
import type {PaintScreenProps} from '@/navigation/types';
import {useTheme} from '@/theme';

// Étape 1 : choisir la forme sur une grille de mini-schémas
export function GuideShapeScreen({navigation}: PaintScreenProps<'GuideShape'>) {
  const {t} = useTranslation();
  const th = useTheme();

  return (
    <ScreenScroll>
      <Text style={[styles.intro, {color: th.muted}]}>{t('paint.guide.shape.intro')}</Text>
      {(['2d', '3d'] as const).map(kind => (
        <View key={kind}>
          <Text style={[styles.section, {color: th.muted}]}>
            {t(kind === '2d' ? 'geometry.kinds.flat' : 'geometry.kinds.solid')}
          </Text>
          <View style={styles.grid}>
            {SURFACE_SHAPES.filter(s => s.kind === kind).map(s => (
              <ShapeTile
                key={s.id}
                shapeId={s.id}
                // Le brouillon en cours n'est remplacé que quand on saisit une mesure dans une autre forme
                onPress={() => navigation.push('GuideDimensions', {shapeId: s.id})}
              />
            ))}
          </View>
        </View>
      ))}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  intro: {fontSize: 18, marginBottom: 12},
  section: {fontSize: 16, marginBottom: 8},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'},
});
