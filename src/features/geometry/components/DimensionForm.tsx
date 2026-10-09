import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NumField} from '@/components';
import {useTheme} from '@/theme';
import {DIM_LETTERS} from '../logic/dims';
import {SURFACE_SHAPES} from '../logic/surfaces';
import type {Unit} from '../logic/surfaces';
import type {ShapeId} from '../logic/geometry';
import {DIM_PALETTE} from './diagrams/diagramParts';
import {UnitChips} from './UnitChips';

type Props = {
  shapeId: ShapeId;
  unit: Unit;
  values: Record<string, string>;
  onChange: (dim: string, value: string) => void;
  onUnit: (unit: Unit) => void;
};

// Champs d'une forme : une ligne par dimension, lettre colorée comme sur le schéma
export function DimensionForm({shapeId, unit, values, onChange, onUnit}: Props) {
  const {t} = useTranslation();
  const shape = SURFACE_SHAPES.find(s => s.id === shapeId)!;
  return (
    <View>
      <UnitChips unit={unit} onUnit={onUnit} />
      {shape.dimensions.map((dim, i) => (
        <View key={dim} style={styles.row}>
          <DimBadge letter={DIM_LETTERS[dim]} color={DIM_PALETTE[i]} />
          <View style={styles.field}>
            <NumField
              label={t(`geometry.dims.${dim}`)}
              unit={unit}
              value={values[dim] ?? ''}
              onChange={v => onChange(dim, v)}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

// Pastille de la lettre (même couleur que sur le schéma)
function DimBadge({letter, color}: {letter: string; color: string}) {
  const t = useTheme();
  return (
    <View style={[styles.badge, {backgroundColor: color}]}>
      <Text style={[styles.letter, {color: t.onPrimary}]}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'flex-start'},
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 18,
  },
  letter: {fontSize: 20, fontWeight: '700'},
  field: {flex: 1},
});
