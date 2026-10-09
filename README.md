# Appaintueuse

Application Android d'aide au calcul pour les **peintres** (aéronautique, industrie), pensée pour être comprise
**sans aisance en maths** : chaque résultat est expliqué étape par étape, avec des schémas, et l'application
ne donne pas la réponse à la place de l'utilisateur quand il veut s'entraîner.

Elle est née d'un besoin concret : savoir **quelle quantité de peinture préparer** pour ne pas en gaspiller
(la peinture coûte cher), pour quelqu'un de dyscalculique qui ne retient pas les tables de multiplication.

> L'application est entièrement **en français** et fonctionne **hors ligne** (utile en atelier).
> Tous les textes sont dans des fichiers de traduction : l'ajout d'une autre langue est prévu.

## Fonctionnalités

| Onglet | Ce qu'on y trouve |
|---|---|
| **Calcul** | Calculatrice avec **curseur déplaçable** dans toute l'expression, historique, `%` à la manière d'une vraie calculatrice, fractions ↔ décimaux. |
| **Maths** | Produit en croix (avec tableau et étapes), pourcentages, triangle rectangle, série de mesures et tolérance. |
| **Géométrie** | 13 formes (carré, rectangle, triangle, losange, disque, trapèze, couronne, cube, pavé, cylindre, cône, cône tronqué, sphère) avec **schéma**, choix des faces à peindre, surface dans l'unité choisie et calcul détaillé. Fiche « Mes formules », surface composée, échelle. |
| **Conversions** | Longueurs, surfaces, volumes, masses, pressions, angles, vitesses, températures (unités métriques), avec « l'escalier des unités » pour comprendre pourquoi 1 m² = 100 dm². |
| **Peinture** | **Combien de peinture ?** en 3 étapes (ce que je peins → la peinture → le résultat en mL), **mélange en parts** (ex. 5-1-1 pour 6 L), dilution, épaisseurs. Le parcours est **sauvegardé** : fermer l'application ne fait rien perdre. |

Pensé pour l'atelier :

- **utilisable à une main**, grandes zones tactiles (≥ 56 px) ;
- **mode « À toi d'essayer »** : l'application dit seulement « c'est plus » ou « c'est moins » et ne montre le résultat et les étapes qu'après la bonne réponse ;
- **raccourci calculatrice** sur chaque résultat chiffré ;
- thème clair / sombre selon le téléphone.

## Installer l'application (Android 7.0 et plus)

1. Ouvrir la page [**Releases**](../../releases/latest) depuis le téléphone.
2. Télécharger le fichier `appaintueuse-….apk`.
3. L'ouvrir et autoriser l'installation depuis cette source si Android le demande
   (*Paramètres → Applications → Accès spécial → Installer des applications inconnues*).

> L'application n'est pas (encore) sur le Play Store : Android peut afficher un avertissement standard
> pour les applications installées hors du magasin.

## Développement

**Prérequis :** Node.js 22, JDK 21, Android SDK (plateforme 37, build-tools 37.0.0, NDK 27.1.12297006)
et un téléphone avec le débogage USB, ou un émulateur.

```bash
npm ci                  # dépendances
npm start               # serveur Metro (le code est envoyé au téléphone)
npm run android         # compile et installe l'application de développement
```

Si plusieurs JDK sont installés, Gradle doit utiliser le 21. Dans `~/.gradle/gradle.properties` (hors du projet) :

```properties
org.gradle.java.home=/chemin/vers/jdk-21
```

Contrôles de qualité :

```bash
npx tsc --noEmit        # types
npm run lint            # ESLint
npm test                # tests Jest
```

### Organisation du code

```
App.tsx                      point d'entrée
src/
  components/                composants d'interface partagés, un fichier chacun
  theme/                     couleurs clair / sombre, taille des zones tactiles
  utils/                     formatage des nombres, etc.
  i18n/locales/fr/           un fichier de traduction JSON par fonctionnalité
  navigation/                onglets, piles d'écrans, types des routes
  storage/                   sauvegarde locale (AsyncStorage)
  features/
    calculator/  maths/  geometry/  conversions/  paint/  learning/
      screens/               un fichier par écran
      components/  hooks/    éléments propres à la fonctionnalité
      logic/                 calculs purs, avec leurs tests à côté
```

Conventions : fichiers de 300 lignes maximum, alias d'import `@/` (= `src/`), aucun texte en dur dans
les écrans (tout passe par `t('…')`), couleurs uniquement via le thème, logique de calcul séparée de l'interface
et testée. Un test vérifie que toutes les clés de traduction utilisées existent.

### Construire l'APK de publication

La version publiée est signée avec une clé propre au projet, **qui n'est pas dans le dépôt**.
Ses identifiants se renseignent dans `~/.gradle/gradle.properties` :

```properties
APPAINTUEUSE_STORE_FILE=/chemin/vers/appaintueuse-release.keystore
APPAINTUEUSE_STORE_PASSWORD=…
APPAINTUEUSE_KEY_ALIAS=appaintueuse
APPAINTUEUSE_KEY_PASSWORD=…
```

```bash
cd android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a
# → android/app/build/outputs/apk/release/app-release.apk
```

Sans ces identifiants, la compilation retombe sur la clé de debug (utile pour un essai local, pas pour publier).
**La même clé doit toujours être utilisée** : Android refuse de mettre à jour une application signée avec une autre clé.

## Intégration continue et releases

Le workflow [`android.yml`](.github/workflows/android.yml) s'exécute à chaque *push* ou *pull request* sur `master` :

1. **Contrôles** : types, lint et tests.
2. **APK release** : compilation d'un APK, déposé en artefact de l'exécution (30 jours).

**Publier une version** se fait sans rien compiler en local, de deux façons :

```bash
git tag v1.0.1 && git push origin v1.0.1      # depuis un terminal
```

ou depuis GitHub : *Actions → Android CI → Run workflow*, en saisissant la version (`1.0.1`).

La CI compile alors l'APK, le signe, crée la *release* (tag, notes, empreinte SHA-256) et y dépose le fichier.
Le numéro de version Android est déduit du tag (`1.2.3` → `versionCode` 10203), il augmente donc toujours.

La signature utilise 4 secrets du dépôt : `KEYSTORE_BASE64` (la clé encodée en base64), `KEYSTORE_PASSWORD`,
`KEY_ALIAS` et `KEY_PASSWORD`. Sans eux, la CI compile quand même mais **ne publie pas** : un APK signé avec une
autre clé ne pourrait pas être installé par-dessus la version déjà présente sur un téléphone.

## Licence

Aucune licence n'est définie pour l'instant : par défaut, tous droits réservés.
