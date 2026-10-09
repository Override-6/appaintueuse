import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MIN_TOUCH, useTheme} from '@/theme';
import {AreaExplain} from './AreaExplain';

type Kind = 'length' | 'area';

// Marches de l'escalier, de la plus grande à la plus petite unité
const LADDERS: Record<Kind, {units: string[]; factor: number}> = {
  length: {units: ['m', 'dm', 'cm', 'mm'], factor: 10},
  area: {units: ['m2', 'dm2', 'cm2', 'mm2'], factor: 100},
};
const STEP_INDENT = 24; // décalage de chaque marche : effet escalier

// Escalier des unités : × 10 en descendant, ÷ 10 en remontant (× 100 pour les surfaces)
export function UnitLadder() {
  const t = useTheme();
  const {t: tr} = useTranslation();
  const [kind, setKind] = useState<Kind>('area');
  const {units, factor} = LADDERS[kind];
  const kinds: {id: Kind; label: string}[] = [
    {id: 'length', label: tr('conversions.understand.length')},
    {id: 'area', label: tr('conversions.understand.area')},
  ];

  return (
    <View>
      <View style={styles.segment}>
        {kinds.map(k => {
          const on = k.id === kind;
          return (
            <Pressable
              key={k.id}
              accessibilityRole="button"
              accessibilityState={{selected: on}}
              onPress={() => setKind(k.id)}
              style={[styles.chip, {backgroundColor: on ? t.primary : t.key}]}>
              <Text style={[styles.chipText, {color: on ? t.onPrimary : t.text}]}>
                {k.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.legend, {color: t.text}]}>
        {tr('conversions.understand.legendDown', {factor})}
      </Text>
      <Text style={[styles.legend, {color: t.text}]}>
        {tr('conversions.understand.legendUp', {factor})}
      </Text>

      <View style={styles.ladder}>
        {units.map((u, i) => (
          <View key={u} style={{marginLeft: i * STEP_INDENT}}>
            <View
              style={[styles.step, {backgroundColor: t.card, borderColor: t.border}]}>
              <Text style={[styles.stepText, {color: t.text}]}>
                {tr(`conversions.units.${u}`)}
              </Text>
            </View>
            {i < units.length - 1 ? (
              <View style={styles.connector}>
                <Text style={[styles.arrow, {color: t.primary}]}>
                  {`↓ ${tr('conversions.understand.times', {factor})}`}
                </Text>
                <Text style={[styles.arrow, {color: t.primary}]}>
                  {`↑ ${tr('conversions.understand.divide', {factor})}`}
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>

      {kind === 'area' ? <AreaExplain /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12},
  chip: {
    minHeight: MIN_TOUCH,
    minWidth: MIN_TOUCH,
    paddingHorizontal: 20,
    borderRadius: 28,
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {fontSize: 17, fontWeight: '600'},
  legend: {fontSize: 16, lineHeight: 22, marginBottom: 4},
  ladder: {marginTop: 8},
  step: {
    minHeight: MIN_TOUCH,
    minWidth: 96,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  stepText: {fontSize: 22, fontWeight: '700'},
  connector: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
    paddingLeft: 12,
  },
  arrow: {fontSize: 16, fontWeight: '600'},
});
