import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {
  ComposedScreen,
  FormulasScreen,
  GeometryMenuScreen,
  ScaleScreen,
  ShapeScreen,
} from '@/features/geometry/screens';
import type {GeometryStackParamList} from './types';
import {useStackOptions} from './useStackOptions';

const Stack = createNativeStackNavigator<GeometryStackParamList>();

export default function GeometryNavigator() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator screenOptions={useStackOptions()}>
      <Stack.Screen name="GeometryMenu" component={GeometryMenuScreen} options={{title: t('tabs.geometry')}} />
      <Stack.Screen
        name="Shape"
        component={ShapeScreen}
        options={({route}) => ({title: t(`geometry.shapes.${route.params.shapeId}`)})}
      />
      <Stack.Screen name="Formulas" component={FormulasScreen} options={{title: t('geometry.menu.formulas')}} />
      <Stack.Screen name="Composed" component={ComposedScreen} options={{title: t('geometry.composed.title')}} />
      <Stack.Screen name="Scale" component={ScaleScreen} options={{title: t('geometry.scale.title')}} />
    </Stack.Navigator>
  );
}
