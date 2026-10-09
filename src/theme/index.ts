import {useColorScheme} from 'react-native';

export const MIN_TOUCH = 56; // zones tactiles généreuses (usage à une main, gants)

const light = {
  bg: '#f4f5f7',
  card: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  primary: '#1d4ed8',
  onPrimary: '#ffffff',
  border: '#d1d5db',
  key: '#e5e7eb',
  danger: '#dc2626',
};

const dark: typeof light = {
  bg: '#0b0f17',
  card: '#151b27',
  text: '#f3f4f6',
  muted: '#9ca3af',
  primary: '#60a5fa',
  onPrimary: '#0b0f17',
  border: '#2b3445',
  key: '#222b3b',
  danger: '#f87171',
};

export type Theme = typeof light;

export const useTheme = (): Theme =>
  useColorScheme() === 'dark' ? dark : light;
