import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Collapsible, ErrorText, ResultCard, ScreenScroll} from '@/components';
import {StepList} from '@/features/learning';
import {RateForm} from '@/features/paint/components/RateForm';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import {useRateDraft} from '@/features/paint/hooks/useRateDraft';
import type {PaintScreenProps} from '@/navigation/types';
import {useTheme} from '@/theme';

// Étape 2 : une seule question, combien de surface couvre 1 litre de cette peinture
export function GuideProductScreen({navigation}: PaintScreenProps<'GuideProduct'>) {
  const {t} = useTranslation();
  const th = useTheme();
  const {setRate} = usePaintPlan();
  const {draft, set, rate, steps} = useRateDraft();
  const [tried, setTried] = useState(false);

  const next = () => {
    setTried(true);
    if (rate === undefined) return;
    setRate(rate);
    navigation.navigate('GuideResult');
  };

  return (
    <ScreenScroll>
      <Text style={[styles.question, {color: th.text}]}>{t('paint.guide.product.question')}</Text>
      <RateForm draft={draft} set={set} />
      {draft.mode === 'area' ? (
        <Text style={[styles.hint, {color: th.muted}]}>{t('paint.guide.product.startHint')}</Text>
      ) : null}
      {tried && rate === undefined ? <ErrorText>{t('paint.guide.product.invalid')}</ErrorText> : null}
      <Button label={t('paint.guide.product.see')} onPress={next} />
      <Collapsible title={t('paint.guide.product.convert')}>
        <ResultCard label={t('paint.guide.product.rate')} value={rate} unit="dm²/L" />
        <StepList steps={steps} />
      </Collapsible>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  question: {fontSize: 20, fontWeight: '600', marginBottom: 12},
  hint: {fontSize: 16, marginBottom: 12},
});
