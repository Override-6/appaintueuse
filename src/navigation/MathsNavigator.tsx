import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {
  MathsMenuScreen,
  PercentScreen,
  RightTriangleScreen,
  CrossProductScreen,
  StatsScreen,
  ToleranceScreen,
} from '@/features/maths/screens';
import type {MathsStackParamList} from './types';
import {useStackOptions} from './useStackOptions';

const Stack = createNativeStackNavigator<MathsStackParamList>();

export default function MathsNavigator() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator screenOptions={useStackOptions()}>
      <Stack.Screen name="MathsMenu" component={MathsMenuScreen} options={{title: t('tabs.maths')}} />
      <Stack.Screen name="CrossProduct" component={CrossProductScreen} options={{title: t('maths.tools.crossProduct')}} />
      <Stack.Screen name="Percent" component={PercentScreen} options={{title: t('maths.tools.percent')}} />
      <Stack.Screen name="RightTriangle" component={RightTriangleScreen} options={{title: t('maths.tools.rightTriangle')}} />
      <Stack.Screen name="Stats" component={StatsScreen} options={{title: t('maths.measures.stats.title')}} />
      <Stack.Screen name="Tolerance" component={ToleranceScreen} options={{title: t('maths.measures.tolerance.title')}} />
    </Stack.Navigator>
  );
}
