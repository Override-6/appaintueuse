import {useCallback, useContext} from 'react';
import {NavigationContext} from '@react-navigation/native';
import type {NavigationProp} from '@react-navigation/native';
import {toInput} from '@/features/calculator/logic/format';
import type {RootTabParamList} from './types';

// Renvoie une fonction qui ouvre l'onglet Calculatrice avec un nombre déjà saisi
// (undefined hors navigation, par exemple dans un test d'écran isolé)
export function useOpenInCalculator(): ((value: number) => void) | undefined {
  const navigation = useContext(NavigationContext) as
    | NavigationProp<RootTabParamList>
    | undefined;
  const open = useCallback(
    (value: number) =>
      navigation?.navigate('Calculator', {initial: toInput(value), nonce: Date.now()}),
    [navigation],
  );
  return navigation ? open : undefined;
}
