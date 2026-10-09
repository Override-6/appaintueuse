import React, {Fragment} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Line, Rect} from 'react-native-svg';
import {useTheme} from '@/theme';

const SIZE = 200; // côté du carré de 1 m, en px
const CELLS = 10; // 10 dm de côté : 10 × 10 = 100 carrés de 1 dm

// Carré de 1 m découpé en 100 carrés de 1 dm : pourquoi × 100
export function AreaExplain() {
  const t = useTheme();
  const {t: tr} = useTranslation();
  const step = SIZE / CELLS;
  const cuts = Array.from({length: CELLS - 1}, (_, i) => (i + 1) * step);

  return (
    <View style={[styles.box, {backgroundColor: t.bg, borderColor: t.border}]}>
      <Text style={[styles.title, {color: t.text}]}>
        {tr('conversions.understand.squareTitle')}
      </Text>
      <View style={styles.squareWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Rect
            x={0}
            y={0}
            width={SIZE}
            height={SIZE}
            fill={t.primary}
            fillOpacity={0.15}
            stroke={t.primary}
            strokeWidth={2}
          />
          {cuts.map(p => (
            <Fragment key={p}>
              <Line x1={p} y1={0} x2={p} y2={SIZE} stroke={t.primary} strokeWidth={1} />
              <Line x1={0} y1={p} x2={SIZE} y2={p} stroke={t.primary} strokeWidth={1} />
            </Fragment>
          ))}
        </Svg>
      </View>
      <Text style={[styles.muted, {color: t.muted}]}>
        {tr('conversions.understand.sideLabel')}
      </Text>

      <Text style={[styles.title, {color: t.text}]}>
        {tr('conversions.understand.whyTitle')}
      </Text>
      <Text style={[styles.line, {color: t.text}]}>{tr('conversions.understand.why1')}</Text>
      <Text style={[styles.line, {color: t.text}]}>{tr('conversions.understand.why2')}</Text>
      <Text style={[styles.line, {color: t.text}]}>{tr('conversions.understand.why3')}</Text>
      <Text style={[styles.example, {color: t.primary}]}>
        {tr('conversions.understand.example')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {borderWidth: 1, borderRadius: 12, padding: 16, marginTop: 8},
  title: {fontSize: 17, fontWeight: '600', marginBottom: 8},
  squareWrap: {alignSelf: 'center', marginBottom: 8},
  muted: {fontSize: 15, textAlign: 'center', marginBottom: 16},
  line: {fontSize: 17, lineHeight: 24, marginBottom: 4},
  example: {fontSize: 19, fontWeight: '700', marginTop: 12},
});
