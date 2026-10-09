import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Collapsible, ErrorText, ScreenScroll} from '@/components';
import {PracticeGate} from '@/features/learning';
import {ResultDetails} from '@/features/paint/components/ResultDetails';
import {ResultSummary} from '@/features/paint/components/ResultSummary';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import {planResult} from '@/features/paint/logic/plan';
import type {PaintScreenProps} from '@/navigation/types';

// Étape 3 : quantité en mL, marge au choix, et détail du calcul replié
export function GuideResultScreen({navigation}: PaintScreenProps<'GuideResult'>) {
  const {t} = useTranslation();
  const {pieces, rateDm2PerL, reset} = usePaintPlan();
  const [margin, setMargin] = useState(0);
  const result = planResult(pieces, rateDm2PerL, margin);

  const again = () => {
    reset();
    navigation.popToTop();
  };

  if (!result) {
    return (
      <ScreenScroll>
        <ErrorText>{t('paint.guide.result.missing')}</ErrorText>
        <Button label={t('paint.guide.result.again')} secondary onPress={again} />
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <PracticeGate answer={result.ml} unit="mL">
        <ResultSummary result={result} margin={margin} onMargin={setMargin} />
        <Collapsible title={t('paint.guide.result.details')}>
          <ResultDetails result={result} rateDm2PerL={rateDm2PerL} />
        </Collapsible>
      </PracticeGate>
      <Button label={t('paint.guide.result.edit')} secondary onPress={() => navigation.popTo('GuideSurface')} />
      <Button label={t('paint.guide.result.again')} secondary onPress={again} />
    </ScreenScroll>
  );
}
