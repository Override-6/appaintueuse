import React from 'react';
import {useTranslation} from 'react-i18next';
import {Chips} from '@/components';
import {LENGTH_UNITS} from '../logic/units';
import type {Unit} from '../logic/surfaces';

type Props = {unit: Unit; onUnit: (u: Unit) => void};

// Choix de l'unité de longueur (mm, cm, dm, m)
export function UnitChips({unit, onUnit}: Props) {
  const {t} = useTranslation();
  return (
    <Chips
      options={LENGTH_UNITS.map(id => ({id, label: t(`geometry.units.${id}`)}))}
      selected={unit}
      onSelect={id => onUnit(id as Unit)}
    />
  );
}
