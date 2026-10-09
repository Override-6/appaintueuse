import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {MIN_TOUCH, useTheme} from '@/theme';

type Props = {label: string; onPress: () => void; secondary?: boolean};

// Gros bouton, zone tactile généreuse
export function Button({label, onPress, secondary}: Props) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, {backgroundColor: secondary ? t.key : t.primary}]}>
      <Text
        style={[styles.label, {color: secondary ? t.text : t.onPrimary}]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  label: {fontSize: 18, fontWeight: '600'},
});
