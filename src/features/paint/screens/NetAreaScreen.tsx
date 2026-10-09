import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, ErrorText, FormulaBlock, NumField, ResultCard, ScreenScroll} from '@/components';
import {useZones} from '@/features/paint/hooks/useZones';
import {pos, unitIf} from '@/features/paint/logic/inputs';
import {netArea} from '@/features/paint/logic/paint';
import type {PaintScreenProps} from '@/navigation/types';
import {useTheme} from '@/theme';
import {parseNumber} from '@/utils/format';

// Surface nette : surface totale moins une liste dynamique de zones retirées
export function NetAreaScreen(_props: PaintScreenProps<'NetArea'>) {
  const {t} = useTranslation();
  const theme = useTheme();
  const [total, setTotal] = useState('');
  const {zones, addZone, setZone} = useZones();

  const totalN = pos(parseNumber(total));
  const zonesN = zones.map(z => parseNumber(z) ?? 0);
  const net =
    totalN !== undefined && zonesN.every(z => z >= 0) ? netArea(totalN, zonesN) : undefined;

  const formulas = t('paint.netArea.formulas', {returnObjects: true}) as string[];

  return (
    <ScreenScroll>
      <NumField label={t('paint.netArea.total')} value={total} onChange={setTotal} unit="m²" />
      {zones.map((z, i) => (
        <NumField
          key={i}
          label={`${t('paint.netArea.deduction')} ${i + 1}`}
          value={z}
          onChange={v => setZone(i, v)}
          unit="m²"
        />
      ))}
      <Button label={t('paint.netArea.addDeduction')} onPress={addZone} />
      {net !== undefined && net < 0 ? (
        <>
          <Text style={[styles.label, {color: theme.muted}]}>{t('paint.netArea.net')}</Text>
          <ErrorText>{t('paint.netArea.negative')}</ErrorText>
        </>
      ) : (
        <ResultCard label={t('paint.netArea.net')} value={net} unit={unitIf(net, 'm²')} />
      )}
      <FormulaBlock lines={formulas} />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  label: {marginBottom: 4},
});
