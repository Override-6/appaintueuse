import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import {Collapsible} from './Collapsible';

// Bloc de formules : reçoit les lignes issues du fichier de traduction
export function FormulaBlock({lines}: {lines: string[]}) {
  const t = useTheme();
  const {t: tr} = useTranslation();
  return (
    <Collapsible title={tr('app.formulas')}>
      {lines.map(line => (
        <Text key={line} style={[styles.line, {color: t.text}]}>
          {line}
        </Text>
      ))}
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  line: {fontSize: 16, marginBottom: 4},
});
