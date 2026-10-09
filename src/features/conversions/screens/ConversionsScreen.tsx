import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Chips, Collapsible, NumField, ScreenScroll } from '@/components';
import { MIN_TOUCH, useTheme } from '@/theme';
import { CATEGORIES, convert } from '../logic/conversions';
import { UnitLadder } from '../components/UnitLadder';
import { formatNumber, parseNumber } from '@/utils/format';

type Side = 'from' | 'to';
type Favorite = { cat: string; from: string; to: string };

const START_CAT = 'area'; // l'écran s'ouvre sur les surfaces (m² → dm²)

// Paire d'unités par défaut d'une grandeur
const defaultPair = (catId: string) => {
  const c = CATEGORIES.find(x => x.id === catId)!;
  const [from, to] = c.defaults ?? [c.units[0].id, c.units[1].id];
  return { from, to };
};

export default function ConversionsScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();

  const [catId, setCatId] = useState(START_CAT);
  const [from, setFrom] = useState(() => defaultPair(START_CAT).from);
  const [to, setTo] = useState(() => defaultPair(START_CAT).to);
  // Champ qui a été saisi en dernier : sa valeur fait foi, l'autre est calculée
  const [src, setSrc] = useState<Side>('from');
  const [value, setValue] = useState('');
  const [favs, setFavs] = useState<Favorite[]>([]);

  const cat = CATEGORIES.find(c => c.id === catId)!;
  // Seules la température et l'angle peuvent être négatifs
  const canBeNegative = catId === 'temperature' || catId === 'angle';
  const srcUnit = src === 'from' ? from : to;
  const otherUnit = src === 'from' ? to : from;

  const n = parseNumber(value);
  const computed =
    n === undefined ? '' : formatNumber(convert(cat, srcUnit, otherUnit, n));
  const fromText = src === 'from' ? value : computed;
  const toText = src === 'to' ? value : computed;

  const unitOptions = cat.units.map(u => ({
    id: u.id,
    label: tr(`conversions.units.${u.id}`),
  }));
  const categoryOptions = CATEGORIES.map(c => ({
    id: c.id,
    label: tr(`conversions.categories.${c.id}`),
  }));
  const unitLabel = (id: string) => tr(`conversions.units.${id}`);

  // Changement de grandeur : on repart à zéro (valeur vidée, unités par défaut)
  const selectCategory = (id: string) => {
    const p = defaultPair(id);
    setCatId(id);
    setFrom(p.from);
    setTo(p.to);
    setSrc('from');
    setValue('');
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setSrc(src === 'from' ? 'to' : 'from');
  };

  const isFav = favs.some(
    f => f.cat === catId && f.from === from && f.to === to,
  );

  const addFav = () => setFavs(list => [...list, { cat: catId, from, to }]);

  const removeFav = (index: number) =>
    setFavs(list => list.filter((_, j) => j !== index));

  const loadFav = (f: Favorite) => {
    setCatId(f.cat);
    setFrom(f.from);
    setTo(f.to);
  };

  return (
    <ScreenScroll>

      {favs.length > 0 ? (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: t.muted, marginBottom: 6, fontSize: 16 }}>
            {tr('conversions.favorites')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {favs.map((f, i) => (
              <View
                key={`${f.cat}|${f.from}|${f.to}|${i}`}
                style={[s.favChip, { backgroundColor: t.key }]}
              >
                <Pressable
                  accessibilityRole="button"
                  onPress={() => loadFav(f)}
                  style={s.favMain}
                >
                  <Text style={{ color: t.text, fontSize: 16 }}>
                    {`${tr(`conversions.categories.${f.cat}`)} : ${unitLabel(
                      f.from,
                    )} → ${unitLabel(f.to)}`}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => removeFav(i)}
                  style={s.favRemove}
                >
                  <Text style={{ color: t.muted, fontSize: 20 }}>✕</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <Collapsible title={tr('conversions.understand.title')}>
        <UnitLadder />
      </Collapsible>

      <Chips
        options={categoryOptions}
        selected={catId}
        onSelect={selectCategory}
      />

      <NumField
        signed={canBeNegative}
        label={tr('conversions.from')}
        value={fromText}
        onChange={v => {
          setSrc('from');
          setValue(v);
        }}
      />
      <Chips options={unitOptions} selected={from} onSelect={setFrom} />

      <Button label={tr('conversions.swap')} secondary onPress={swap} />

      <NumField
        signed={canBeNegative}
        label={tr('conversions.to')}
        value={toText}
        onChange={v => {
          setSrc('to');
          setValue(v);
        }}
      />
      <Chips options={unitOptions} selected={to} onSelect={setTo} />

      {isFav ? null : (
        <Button label={tr('conversions.addFavorite')} onPress={addFav} />
      )}
    </ScreenScroll>
  );
}

const s = StyleSheet.create({
  favChip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH,
    borderRadius: 22,
    marginRight: 8,
    paddingLeft: 16,
  },
  favMain: { justifyContent: 'center', paddingVertical: 8 },
  favRemove: {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
