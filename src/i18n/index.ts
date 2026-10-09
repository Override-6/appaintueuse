import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import calculator from './locales/fr/calculator.json';
import common from './locales/fr/common.json';
import conversions from './locales/fr/conversions.json';
import geometry from './locales/fr/geometry.json';
import learning from './locales/fr/learning.json';
import maths from './locales/fr/maths.json';
import mix from './locales/fr/mix.json';
import paint from './locales/fr/paint.json';

// Un fichier JSON par fonctionnalité, fusionnés en un seul espace de noms.
// Pour ajouter une langue : créer locales/<code>/ avec les mêmes fichiers
// et l'enregistrer dans `resources`.
const fr = {...common, ...calculator, ...maths, ...geometry, ...conversions, ...paint, ...learning, ...mix};

i18n.use(initReactI18next).init({
  resources: {fr: {translation: fr}},
  lng: 'fr',
  fallbackLng: 'fr',
  returnObjects: true,
  interpolation: {escapeValue: false},
});

export default i18n;
