import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, ErrorText, FormulaBlock, ScreenScroll} from '@/components';
import {
  PartsBar,
  PracticeGate,
  PracticeToggle,
  splitInParts,
  usePractice,
} from '@/features/learning';
import {MixResults} from '@/features/paint/components/MixResults';
import {PartsEditor} from '@/features/paint/components/PartsEditor';
import {VolumeField} from '@/features/paint/components/VolumeField';
import {
  DEFAULT_PARTS,
  DEFAULT_TOTAL_L,
  convertVolume,
  roundTo,
  toLiters,
  validateMix,
  type MixError,
  type VolumeUnit,
} from '@/features/paint/logic/mix';
import type {PaintScreenProps} from '@/navigation/types';
import {useTheme} from '@/theme';
import {parseNumber} from '@/utils/format';

const ERROR_KEYS: Record<MixError, string> = {
  tooFew: 'mix.errors.tooFew',
  partsNotInteger: 'mix.errors.partsNotInteger',
  missingTotal: 'mix.errors.missingTotal',
};

// Mélange en parts : on saisit les parts, le total, puis chaque quantité en L et en mL
export function MixScreen(_props: PaintScreenProps<'Mix'>) {
  const {t} = useTranslation();
  const th = useTheme();
  const {enabled} = usePractice();
  const [parts, setParts] = useState<number[]>(DEFAULT_PARTS);
  const [unit, setUnit] = useState<VolumeUnit>('L');
  const [total, setTotal] = useState(String(DEFAULT_TOTAL_L));

  const totalN = parseNumber(total);
  const totalL = totalN === undefined ? undefined : toLiters(totalN, unit);
  const error = validateMix(parts, totalL);
  const result = error || totalL === undefined ? undefined : splitInParts(parts, totalL);
  const amounts = result?.amounts ?? [];
  // Réponse attendue en mode essai : quantité du produit 1, en mL
  const firstMl = amounts.length > 0 ? roundTo(amounts[0] * 1000, 1) : undefined;
  const formulas = t('mix.formulas', {returnObjects: true}) as string[];

  // Changer d'unité convertit la quantité déjà saisie (6 L → 6 000 mL)
  const changeUnit = (next: VolumeUnit) => {
    if (totalN !== undefined) {
      setTotal(String(convertVolume(totalN, unit, next)));
    }
    setUnit(next);
  };

  const reset = () => {
    setParts(DEFAULT_PARTS);
    setUnit('L');
    setTotal(String(DEFAULT_TOTAL_L));
  };

  return (
    <ScreenScroll>
      <PracticeToggle />
      <Text style={[styles.hint, {color: th.muted}]}>{t('mix.intro')}</Text>
      <PartsBar items={parts.map((p, i) => ({label: t('mix.component', {n: i + 1}), parts: p}))} />
      <PartsEditor parts={parts} onChange={setParts} />
      <VolumeField value={total} unit={unit} onChange={setTotal} onUnitChange={changeUnit} />
      {error ? <ErrorText>{t(ERROR_KEYS[error])}</ErrorText> : null}
      {result && firstMl !== undefined && totalL !== undefined ? (
        <>
          {enabled ? <Text style={[styles.hint, {color: th.muted}]}>{t('mix.practiceHint')}</Text> : null}
          <PracticeGate answer={firstMl}>
            <MixResults
              names={parts.map((_, i) => t('mix.component', {n: i + 1}))}
              amounts={amounts}
              total={totalL}
              steps={result.steps}
            />
          </PracticeGate>
        </>
      ) : null}
      <Button label={t('app.reset')} secondary onPress={reset} />
      <FormulaBlock lines={formulas} />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  hint: {marginBottom: 12, fontSize: 16},
});
