import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {PaintPlanProvider} from '@/features/paint/context/PaintPlanContext';
import {
  GuideDimensionsScreen,
  GuideKnownSurfaceScreen,
  GuideProductScreen,
  GuideResultScreen,
  GuideShapeScreen,
  GuideSurfaceScreen,
  MixScreen,
  NetAreaScreen,
  PaintMenuScreen,
  ThicknessScreen,
  ThinnerScreen,
} from '@/features/paint/screens';
import type {PaintStackParamList} from './types';
import {useStackOptions} from './useStackOptions';

const Stack = createNativeStackNavigator<PaintStackParamList>();

// Pile de l'onglet peinture : menu, parcours guidé (contexte partagé) et outils
export default function PaintNavigator() {
  const {t} = useTranslation();
  return (
    <PaintPlanProvider>
      <Stack.Navigator screenOptions={useStackOptions()}>
        <Stack.Screen name="PaintMenu" component={PaintMenuScreen} options={{title: t('tabs.paint')}} />
        <Stack.Screen name="GuideSurface" component={GuideSurfaceScreen} options={{title: t('paint.guide.steps.surface')}} />
        <Stack.Screen name="GuideShape" component={GuideShapeScreen} options={{title: t('paint.guide.steps.shape')}} />
        <Stack.Screen name="GuideDimensions" component={GuideDimensionsScreen} options={{title: t('paint.guide.steps.dimensions')}} />
        <Stack.Screen name="GuideKnownSurface" component={GuideKnownSurfaceScreen} options={{title: t('paint.guide.steps.known')}} />
        <Stack.Screen name="GuideProduct" component={GuideProductScreen} options={{title: t('paint.guide.steps.product')}} />
        <Stack.Screen name="GuideResult" component={GuideResultScreen} options={{title: t('paint.guide.steps.result')}} />
        <Stack.Screen name="Mix" component={MixScreen} options={{title: t('paint.tools.mix')}} />
        <Stack.Screen name="NetArea" component={NetAreaScreen} options={{title: t('paint.tools.netArea')}} />
        <Stack.Screen name="Thinner" component={ThinnerScreen} options={{title: t('paint.tools.thinner')}} />
        <Stack.Screen name="Thickness" component={ThicknessScreen} options={{title: t('paint.tools.thickness')}} />
      </Stack.Navigator>
    </PaintPlanProvider>
  );
}
