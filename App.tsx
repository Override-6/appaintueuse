import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './src/i18n';
import {PracticeProvider} from '@/features/learning';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const dark = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <PracticeProvider>
        <RootNavigator />
      </PracticeProvider>
    </SafeAreaProvider>
  );
}
