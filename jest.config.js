const esmPackages = [
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@react-navigation',
  'lucide-react-native',
  'react-native-svg',
  'react-native-screens',
  'react-native-safe-area-context',
  '@react-native-async-storage',
].join('|');

module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Jest lit la version CommonJS des icônes (la version .mjs n'est pas transformée)
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  // Les bibliothèques de navigation sont publiées en modules ES : à transformer
  transformIgnorePatterns: [`node_modules/(?!(${esmPackages})/)`],
};
