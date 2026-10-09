import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Line, Rect} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import {useTheme, type Theme} from '@/theme';
import {LK} from '../keys';

export type PartItem = {label: string; parts: number};
type Props = {items: PartItem[]};

const BAR_HEIGHT = 56;

// Couleur par composant, tirée du thème (cyclique, pas de hex)
const tone = (t: Theme, i: number) => [t.primary, t.danger, t.muted, t.text, t.border][i % 5];

// Barre découpée en blocs égaux (1 bloc = 1 part), composants regroupés en couleur
export function PartsBar({items}: Props) {
  const t = useTheme();
  const {t: tr} = useTranslation();
  const visible = items.filter(it => it.parts > 0);
  const total = visible.reduce((s, it) => s + it.parts, 0);
  if (total === 0) {
    return null;
  }

  // Position de départ (en blocs) de chaque composant
  let start = 0;
  const segments = visible.map((it, i) => {
    const seg = {...it, index: i, start};
    start += it.parts;
    return seg;
  });

  return (
    <View>
      <Svg width="100%" height={BAR_HEIGHT} viewBox={`0 0 ${total} 1`} preserveAspectRatio="none">
        {segments.map(seg => (
          <Rect
            key={`r${seg.index}`}
            x={seg.start}
            y={0}
            width={seg.parts}
            height={1}
            fill={tone(t, seg.index)}
          />
        ))}
        {Array.from({length: total - 1}, (_, k) => (
          <Line key={`l${k}`} x1={k + 1} y1={0} x2={k + 1} y2={1} stroke={t.card} strokeWidth={0.05} />
        ))}
      </Svg>
      <View style={styles.legend}>
        {segments.map(seg => (
          <View key={`g${seg.index}`} style={styles.legendRow}>
            <View style={[styles.swatch, {backgroundColor: tone(t, seg.index)}]} />
            <Text style={[styles.legendText, {color: t.text}]}>{seg.label}</Text>
            <Text style={[styles.legendCount, {color: t.muted}]}>
              {tr(LK.partsLegend, {count: seg.parts})}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {marginTop: 8},
  legendRow: {flexDirection: 'row', alignItems: 'center', minHeight: 32},
  swatch: {width: 16, height: 16, borderRadius: 4, marginRight: 8},
  legendText: {flex: 1, fontSize: 16},
  legendCount: {fontSize: 16},
});
