import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Chips,
  ErrorText,
  NumField,
  ResultCard,
  ScreenScroll,
} from '@/components';
import {Formulas} from '../components/Formulas';
import {composedTotal, hasNegativeRow} from '../logic/composed';
import type {ComposedRow} from '../logic/composed';

// Surface composée : somme ou différence d'aires saisies ligne à ligne
export function ComposedScreen() {
  const {t} = useTranslation();
  const [rows, setRows] = useState<ComposedRow[]>([]);
  const nextKey = useRef(1);

  const updateRow = (key: number, patch: Partial<ComposedRow>) =>
    setRows(rs => rs.map(r => (r.key === key ? {...r, ...patch} : r)));

  return (
    <ScreenScroll>
      {rows.map((r, i) => (
        <View key={r.key}>
          <NumField
            label={`${t('geometry.outputs.area')} ${i + 1}`}
            unit={t('conversions.units.m2')}
            value={r.value}
            onChange={v => updateRow(r.key, {value: v})}
          />
          <Chips
            options={[
              {id: 'add', label: t('geometry.composed.addMode')},
              {id: 'sub', label: t('geometry.composed.subtract')},
            ]}
            selected={r.mode}
            onSelect={m => updateRow(r.key, {mode: m})}
          />
          <Button
            label={t('geometry.composed.remove')}
            secondary
            onPress={() => setRows(rs => rs.filter(x => x.key !== r.key))}
          />
        </View>
      ))}
      <Button
        label={t('geometry.composed.add')}
        onPress={() => {
          const key = nextKey.current++;
          setRows(rs => [...rs, {key, value: '', mode: 'add'}]);
        }}
      />
      <ResultCard
        label={t('geometry.composed.total')}
        value={rows.length ? composedTotal(rows) : undefined}
        unit={t('conversions.units.m2')}
      />
      {hasNegativeRow(rows) ? <ErrorText>{t('geometry.negative')}</ErrorText> : null}
      <Formulas formulaKey="geometry.composed.formulas" />
    </ScreenScroll>
  );
}
