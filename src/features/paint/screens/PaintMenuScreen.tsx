import React from 'react';
import {Collapsible, ScreenScroll, ToolCard} from '@/components';
import {PracticeToggle} from '@/features/learning';
import {usePaintPlan} from '@/features/paint/context/PaintPlanContext';
import type {PaintScreenProps} from '@/navigation/types';
import {useTranslation} from 'react-i18next';

// Outils secondaires, repliés sous les deux parcours principaux
const OTHER_TOOLS = [
  {route: 'NetArea', key: 'netArea'},
  {route: 'Thinner', key: 'thinner'},
  {route: 'Thickness', key: 'thickness'},
] as const;

export function PaintMenuScreen({navigation}: PaintScreenProps<'PaintMenu'>) {
  const {t} = useTranslation();
  const {reset} = usePaintPlan();
  return (
    <ScreenScroll>
      <PracticeToggle />
      <ToolCard
        title={t('paint.menu.guide')}
        subtitle={t('paint.menu.guideHint')}
        onPress={() => {
          reset();
          navigation.navigate('GuideSurface');
        }}
      />
      <ToolCard title={t('paint.menu.mix')} onPress={() => navigation.navigate('Mix')} />
      <Collapsible title={t('paint.menu.others')}>
        {OTHER_TOOLS.map(tool => (
          <ToolCard
            key={tool.route}
            title={t(`paint.tools.${tool.key}`)}
            onPress={() => navigation.navigate(tool.route)}
          />
        ))}
      </Collapsible>
    </ScreenScroll>
  );
}
