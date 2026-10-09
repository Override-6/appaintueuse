import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {useTheme} from '../theme';

// Apparence commune des en-têtes de pile (couleurs du thème clair/sombre)
export function useStackOptions(): NativeStackNavigationOptions {
  const t = useTheme();
  return {
    headerStyle: {backgroundColor: t.card},
    headerTintColor: t.text,
    headerTitleStyle: {fontWeight: '700'},
    contentStyle: {backgroundColor: t.bg},
  };
}
