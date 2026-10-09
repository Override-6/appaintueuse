import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Collapsible, ScreenScroll, ToolCard} from '@/components';
import {useTheme} from '@/theme';
import type {MathsScreenProps} from '@/navigation/types';

export function MathsMenuScreen({navigation}: MathsScreenProps<'MathsMenu'>) {
  const {t} = useTranslation();
  const theme = useTheme();
  return (
    <ScreenScroll>
      <Text style={[styles.pick, {color: theme.text}]}>{t('maths.pick')}</Text>
      <ToolCard
        title={t('maths.tools.crossProduct')}
        subtitle={t('maths.toolHints.crossProduct')}
        onPress={() => navigation.navigate('CrossProduct')}
      />
      <ToolCard
        title={t('maths.tools.percent')}
        subtitle={t('maths.toolHints.percent')}
        onPress={() => navigation.navigate('Percent')}
      />
      <ToolCard
        title={t('maths.tools.rightTriangle')}
        subtitle={t('maths.toolHints.rightTriangle')}
        onPress={() => navigation.navigate('RightTriangle')}
      />
      <Collapsible title={t('maths.measures.title')}>
        <ToolCard
          title={t('maths.measures.stats.title')}
          onPress={() => navigation.navigate('Stats')}
        />
        <ToolCard
          title={t('maths.measures.tolerance.title')}
          onPress={() => navigation.navigate('Tolerance')}
        />
      </Collapsible>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  pick: {fontSize: 20, fontWeight: '700', marginBottom: 12},
});
