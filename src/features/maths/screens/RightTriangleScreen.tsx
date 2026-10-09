import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FormulaBlock, NumField, ResultCard, ScreenScroll} from '@/components';
import {solveRightTriangle} from '@/features/maths/logic/maths';
import {Hint} from '@/features/maths/components/Hint';
import {useNumericField} from '@/features/maths/hooks/useNumericField';
import {useTheme} from '@/theme';
import type {MathsScreenProps} from '@/navigation/types';

// Ordre de priorité : seules les deux premières valeurs renseignées sont utilisées
const TRI_KEYS = ['a', 'b', 'c', 'angleA'] as const;
type TriKey = (typeof TRI_KEYS)[number];

export function RightTriangleScreen(_props: MathsScreenProps<'RightTriangle'>) {
  const {t} = useTranslation();
  const theme = useTheme();
  const fields = {
    a: useNumericField(),
    b: useNumericField(),
    c: useNumericField(),
    angleA: useNumericField(),
  };

  const given: Partial<Record<TriKey, number>> = {};
  let count = 0; // nombre de valeurs utilisées (0 à 2)
  let filled = 0; // nombre total de valeurs renseignées
  for (const k of TRI_KEYS) {
    const n = fields[k].value;
    if (n === undefined) continue;
    filled++;
    if (count < 2) {
      given[k] = n;
      count++;
    }
  }
  const sidesOk = (['a', 'b', 'c'] as TriKey[]).every(
    k => given[k] === undefined || given[k]! > 0,
  );
  const tri = sidesOk ? solveRightTriangle(given) : null;

  return (
    <ScreenScroll>
      <Hint>{t('maths.rightTriangle.intro')}</Hint>
      <NumField
        label={t('maths.rightTriangle.a')}
        value={fields.a.text}
        onChange={fields.a.setText}
      />
      <NumField
        label={t('maths.rightTriangle.b')}
        value={fields.b.text}
        onChange={fields.b.setText}
      />
      <NumField
        label={t('maths.rightTriangle.c')}
        value={fields.c.text}
        onChange={fields.c.setText}
      />
      <NumField
        label={t('maths.rightTriangle.angleA')}
        value={fields.angleA.text}
        onChange={fields.angleA.setText}
      />
      {filled > 2 ? (
        <Text style={[styles.extra, {color: theme.muted}]}>
          {t('maths.rightTriangle.extraIgnored')}
        </Text>
      ) : null}
      <ResultCard label={t('maths.rightTriangle.a')} value={tri?.a} />
      <ResultCard label={t('maths.rightTriangle.b')} value={tri?.b} />
      <ResultCard label={t('maths.rightTriangle.c')} value={tri?.c} />
      <ResultCard label={t('maths.rightTriangle.angleA')} value={tri?.angleA} unit="°" />
      <ResultCard label={t('maths.rightTriangle.angleB')} value={tri?.angleB} unit="°" />
      {count >= 2 && !tri ? <Hint>{t('maths.rightTriangle.invalid')}</Hint> : null}
      <FormulaBlock
        lines={t('maths.rightTriangle.formulas', {returnObjects: true}) as string[]}
      />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  extra: {fontSize: 13, marginBottom: 8},
});
