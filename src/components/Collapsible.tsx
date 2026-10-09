import React, {ReactNode, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/theme';

type Props = {title: string; children: ReactNode};

// Section repliable (formules, mesures…)
export function Collapsible({title, children}: Props) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View
      style={[styles.card, {backgroundColor: t.card, borderColor: t.border}]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{expanded: open}}
        onPress={() => setOpen(o => !o)}
        style={styles.head}>
        <Text style={[styles.title, {color: t.text}]}>{title}</Text>
        <Text style={[styles.chevron, {color: t.muted}]}>{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12},
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  title: {fontSize: 18, fontWeight: '600'},
  chevron: {fontSize: 18},
  body: {marginTop: 8},
});
