import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components';
import {MIN_TOUCH, useTheme} from '@/theme';
import {SURFACE_SHAPES} from '../logic/surfaces';
import type {ShapeId} from '../logic/geometry';

type Props = {
  shapeId: ShapeId;
  selected: string[];
  onChange: (ids: string[]) => void;
};

// Cases à cocher : faces de la forme à peindre
export function PartsPicker({shapeId, selected, onChange}: Props) {
  const {t} = useTranslation();
  const th = useTheme();
  const parts = SURFACE_SHAPES.find(s => s.id === shapeId)!.parts;
  const allIds = parts.map(p => p.id);
  const allOn = allIds.every(id => selected.includes(id));

  const toggle = (id: string) =>
    onChange(
      selected.includes(id)
        ? selected.filter(x => x !== id)
        : allIds.filter(x => x === id || selected.includes(x)),
    );

  return (
    <View style={styles.box}>
      <Text style={[styles.title, {color: th.text}]}>{t('geometry.paint.parts')}</Text>
      {parts.map(p => {
        const on = selected.includes(p.id);
        return (
          <Pressable
            key={p.id}
            accessibilityRole="checkbox"
            accessibilityState={{checked: on}}
            onPress={() => toggle(p.id)}
            style={[styles.row, {borderColor: th.border, backgroundColor: th.card}]}>
            <View
              style={[
                styles.check,
                {borderColor: th.border, backgroundColor: on ? th.primary : th.key},
              ]}>
              <Text style={[styles.tick, {color: th.onPrimary}]}>{on ? '✓' : ''}</Text>
            </View>
            <Text style={[styles.label, {color: th.text}]}>
              {t(`geometry.parts.${shapeId}.${p.id}.name`)}
            </Text>
          </Pressable>
        );
      })}
      <Button
        label={t(allOn ? 'geometry.paint.none' : 'geometry.paint.all')}
        secondary
        onPress={() => onChange(allOn ? [] : allIds)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {marginBottom: 12},
  title: {fontSize: 18, fontWeight: '600', marginBottom: 8},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tick: {fontSize: 18, fontWeight: '700'},
  label: {fontSize: 18, flex: 1},
});
