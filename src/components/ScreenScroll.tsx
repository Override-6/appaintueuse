import React, {ReactNode} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '@/theme';

// Conteneur d'écran défilable (le clavier ne masque pas les champs)
export function ScreenScroll({children}: {children: ReactNode}) {
  const t = useTheme();
  return (
    <ScrollView
      style={{backgroundColor: t.bg}}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {padding: 16, paddingBottom: 32},
});
