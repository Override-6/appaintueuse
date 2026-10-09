import React from 'react';
import {useTranslation} from 'react-i18next';
import {FormulaBlock} from '@/components';

// Formules traduites : la clé pointe vers un tableau de lignes
export function Formulas({formulaKey}: {formulaKey: string}) {
  const {t} = useTranslation();
  const lines = t(formulaKey, {returnObjects: true}) as string[];
  return <FormulaBlock lines={lines} />;
}
