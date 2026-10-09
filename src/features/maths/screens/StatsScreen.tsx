import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FormulaBlock, ResultCard, ScreenScroll} from '@/components';
import {parseSeries, seriesStats} from '@/features/maths/logic/stats';
import {Hint} from '@/features/maths/components/Hint';
import {useTheme} from '@/theme';
import type {MathsScreenProps} from '@/navigation/types';

export function StatsScreen(_props: MathsScreenProps<'Stats'>) {
  const {t} = useTranslation();
  const theme = useTheme();
  const [text, setText] = useState('');
  const st = seriesStats(parseSeries(text));

  return (
    <ScreenScroll>
      <Hint>{t('maths.measures.stats.hint')}</Hint>
      <View style={styles.field}>
        <Text style={[styles.label, {color: theme.muted}]}>
          {t('maths.measures.stats.values')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {color: theme.text, backgroundColor: theme.card, borderColor: theme.border},
          ]}
          value={text}
          onChangeText={setText}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          placeholder="0"
          placeholderTextColor={theme.muted}
        />
      </View>
      <ResultCard label={t('maths.measures.stats.count')} value={st?.count} />
      <ResultCard label={t('maths.measures.stats.mean')} value={st?.mean} />
      <ResultCard label={t('maths.measures.stats.min')} value={st?.min} />
      <ResultCard label={t('maths.measures.stats.max')} value={st?.max} />
      <FormulaBlock
        lines={t('maths.measures.stats.formulas', {returnObjects: true}) as string[]}
      />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  field: {marginBottom: 12},
  label: {marginBottom: 4},
  input: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 12,
    fontSize: 22,
  },
});
