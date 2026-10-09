import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/theme';

type Pair = [string, string];
type Props = {
  headers: Pair;
  knownLabel: string;
  known: Pair;
  soughtLabel: string;
  sought: Pair;
};

// Tableau à 2 colonnes : ligne « connu », ligne « cherché » avec « ? » en évidence
export function CrossTable({headers, knownLabel, known, soughtLabel, sought}: Props) {
  const t = useTheme();
  return (
    <View style={[styles.table, {borderColor: t.border, backgroundColor: t.card}]}>
      <Row label="" left={headers[0]} right={headers[1]} header />
      <Row label={knownLabel} left={known[0]} right={known[1]} />
      <Row label={soughtLabel} left={sought[0]} right={sought[1]} />
    </View>
  );
}

type RowProps = {label: string; left: string; right: string; header?: boolean};

function Row({label, left, right, header}: RowProps) {
  const t = useTheme();
  const cell = (value: string) => {
    const unknown = value === '?';
    return (
      <View style={[styles.cell, unknown && {backgroundColor: t.primary}]}>
        <Text
          style={[
            header ? styles.head : styles.value,
            {color: unknown ? t.onPrimary : header ? t.muted : t.text},
          ]}>
          {value}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.row}>
      <Text style={[styles.label, {color: t.muted}]}>{label}</Text>
      {cell(left)}
      <Text style={[styles.arrow, {color: t.muted}]}>{header ? '' : '↔'}</Text>
      {cell(right)}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {borderWidth: 1, borderRadius: 14, padding: 8, marginBottom: 12},
  row: {flexDirection: 'row', alignItems: 'center', minHeight: 56},
  label: {width: 84, fontSize: 15},
  cell: {flex: 1, minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  head: {fontSize: 15, fontWeight: '600'},
  value: {fontSize: 22, fontWeight: '600'},
  arrow: {width: 36, textAlign: 'center', fontSize: 22},
});
