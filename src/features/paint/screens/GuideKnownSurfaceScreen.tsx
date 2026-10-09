import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Chips, ErrorText, NumField, ScreenScroll} from '@/components';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import {parseCount} from '@/features/paint/logic/plan';
import {blankKnownDraft, type KnownDraft} from '@/features/paint/logic/persist';
import {toDm2, type SurfaceUnit} from '@/features/paint/logic/surface';
import type {PaintScreenProps} from '@/navigation/types';
import {useTheme} from '@/theme';
import {formatNumber, parseNumber} from '@/utils/format';

const UNITS: {id: SurfaceUnit; label: string}[] = [
  {id: 'm2', label: 'm²'},
  {id: 'dm2', label: 'dm²'},
  {id: 'cm2', label: 'cm²'},
];

// Surface déjà connue : valeur, unité, nombre d'exemplaires, conversion en dm²
// Le brouillon est gardé dans le contexte à chaque frappe
export function GuideKnownSurfaceScreen({navigation}: PaintScreenProps<'GuideKnownSurface'>) {
  const {t} = useTranslation();
  const th = useTheme();
  const {knownDraft, setKnownDraft, clearKnownDraft, addPiece} = usePaintPlan();
  const draft: KnownDraft = knownDraft ?? blankKnownDraft();
  const {value, unit} = draft;

  const set = (patch: Partial<KnownDraft>) => setKnownDraft({...draft, ...patch});

  const area = parseNumber(value);
  const count = parseCount(draft.count);
  const dm2 = area !== undefined && area > 0 ? toDm2(area, unit) : undefined;

  const add = () => {
    if (dm2 !== undefined && count !== undefined) {
      addPiece({areaDm2: dm2, count});
      clearKnownDraft();
      navigation.popTo('GuideSurface');
    }
  };

  return (
    <ScreenScroll>
      <NumField label={t('paint.guide.known.label')} value={value} onChange={v => set({value: v})} />
      <Chips
        options={UNITS.map(u => ({id: u.id, label: u.label}))}
        selected={unit}
        onSelect={id => set({unit: id as SurfaceUnit})}
      />
      <Text style={[styles.converted, {color: th.text}]}>
        {dm2 !== undefined
          ? t('paint.guide.known.converted', {value: formatNumber(dm2)})
          : t('paint.guide.known.waiting')}
      </Text>
      <NumField
        label={t('paint.guide.count.label')}
        value={draft.count}
        onChange={v => set({count: v})}
      />
      <Text style={[styles.hint, {color: th.muted}]}>{t('paint.guide.count.hint')}</Text>
      {count === undefined ? <ErrorText>{t('paint.guide.count.invalid')}</ErrorText> : null}
      <Button label={t('paint.guide.known.add')} onPress={add} />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  converted: {fontSize: 22, fontWeight: '700', marginBottom: 12},
  hint: {marginBottom: 12},
});
