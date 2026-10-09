import React from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ArrowLeftRight,
  Calculator,
  PaintBucket,
  Sigma,
  Triangle,
} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native';
import {CalculatorScreen} from '@/features/calculator/screens';
import {ConversionsScreen} from '@/features/conversions/screens';
import {MIN_TOUCH, useTheme} from '@/theme';
import GeometryNavigator from './GeometryNavigator';
import MathsNavigator from './MathsNavigator';
import PaintNavigator from './PaintNavigator';
import type {RootTabParamList} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  const t = useTheme();
  const {t: tr} = useTranslation();
  const base = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...base,
        colors: {
          ...base.colors,
          primary: t.primary,
          background: t.bg,
          card: t.card,
          text: t.text,
          border: t.border,
        },
      }}>
      <Tab.Navigator
        initialRouteName="Calculator"
        // Retour du téléphone : revient à la Calculatrice, puis quitte l'app
        backBehavior="initialRoute"
        screenOptions={{
          tabBarActiveTintColor: t.primary,
          tabBarInactiveTintColor: t.muted,
          tabBarStyle: {height: MIN_TOUCH + 16},
          tabBarLabelStyle: {fontSize: 12},
          // Les onglets à pile affichent l'en-tête de leur pile
          headerShown: false,
        }}>
        <Tab.Screen
          name="Calculator"
          component={CalculatorScreen}
          options={{
            headerShown: true,
            title: tr('tabs.calculator'),
            tabBarIcon: ({color, size}) => <Calculator color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Maths"
          component={MathsNavigator}
          options={{
            title: tr('tabs.maths'),
            tabBarIcon: ({color, size}) => <Sigma color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Geometry"
          component={GeometryNavigator}
          options={{
            title: tr('tabs.geometry'),
            tabBarIcon: ({color, size}) => <Triangle color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Conversions"
          component={ConversionsScreen}
          options={{
            headerShown: true,
            title: tr('tabs.conversions'),
            tabBarIcon: ({color, size}) => <ArrowLeftRight color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Paint"
          component={PaintNavigator}
          options={{
            title: tr('tabs.paint'),
            tabBarIcon: ({color, size}) => <PaintBucket color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
