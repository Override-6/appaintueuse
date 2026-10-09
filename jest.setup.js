// Mock officiel de la zone sûre (fournit insets et cadre fixes)
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

// Mock officiel du stockage local (en mémoire, par base : voir clearAllMockStorages)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);
