import {useState} from 'react';
import {parseNumber} from '@/utils/format';

// Saisie numérique : garde le texte tapé et sa valeur analysée (undefined si invalide)
export function useNumericField(initial = '') {
  const [text, setText] = useState(initial);
  return {text, setText, value: parseNumber(text)};
}
