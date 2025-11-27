# ViteTest Benchmarks and Unit Tests

Système de tests pour le projet LesPetitPlats, incluant les tests unitaires et les benchmarks de performance.

## 🎯 À propos

Ce dossier contient deux systèmes de test complémentaires pour le projet LesPetitPlats :

- **Benchmarks** : Système de benchmarking pour mesurer et comparer les performances des algorithmes de recherche et de filtrage utilisés dans l'application
- **Unit Tests** : Tests unitaires et de composants pour valider le comportement fonctionnel de l'application et garantir la qualité du code

Les deux systèmes utilisent **Vitest** comme framework de test, avec des configurations adaptées à leurs besoins spécifiques. Les benchmarks génèrent des rapports HTML détaillés avec statistiques, graphiques et recommandations, tandis que les tests unitaires assurent la couverture de code et la validation fonctionnelle.

## ✨ Fonctionnalités

### Benchmarks

- ⚡ **Mesure de performance** : Comparaison des performances entre différentes implémentations d'algorithmes
- 📊 **Rapports HTML détaillés** : Génération automatique de rapports avec statistiques, graphiques et visualisations
- 🎯 **Tests ciblés** : Possibilité d'exécuter tous les tests ou de sélectionner des tests spécifiques
- 📈 **Métriques avancées** : Temps moyen, min, max, RME (Relative Measurement Error), taux de victoire
- 💡 **Recommandations** : Insights et suggestions d'optimisation basées sur les résultats
- 🔍 **Tests de performance** : Recherche par terme, filtrage par ingrédients, appareils et ustensiles

### Unit Tests

- ✅ **Tests unitaires** : Validation du comportement fonctionnel des composants et utilitaires
- 🎭 **Tests de composants** : bodyScroll, cards, dropdown, filters, search, skeletons, scrollToTop
- 🔧 **Tests d'utilitaires** : cache, deliveryImages, errorHandler, recipeApi, recipesBuilder, string
- 📊 **Couverture de code** : Rapports de couverture avec seuils configurables
- 🔄 **Mode watch** : Exécution en temps réel lors des modifications
- 🎪 **Mocks et helpers** : Infrastructure complète pour les tests avec mocks et utilitaires

## 💻 Utilisation

### Benchmarks

#### Installation

Les dépendances sont incluses dans le projet principal. Aucune installation supplémentaire requise.

**Prérequis :**
- **Node.js** : Version 18.0.0 ou supérieure
- **npm** : Généralement inclus avec Node.js (version 9.0.0+)

**Installation des dépendances :**

```bash
npm install
```

**Vérification de l'installation :**

```bash
npm list tinybench chart.js chartjs-node-canvas vitest
```

#### Exécution

```bash
npm run benchmark
```

**Options disponibles :**
- Le script vous demandera si vous souhaitez exécuter tous les tests :
  - **"yes"** → Exécute tous les tests et génère un rapport **"full"**
  - **"no"** → Permet de sélectionner des tests spécifiques et génère un rapport **"partial"**
- Les rapports HTML sont sauvegardés avec un timestamp dans le dossier `Report/` avec le suffixe correspondant (`-full` ou `-partial`)

#### Interprétation des résultats

Les rapports HTML générés contiennent :

- **Résumé exécutif** : Vue d'ensemble des performances avec les gagnants par catégorie
- **Statistiques détaillées** : Temps moyen, min, max, et RME pour chaque implémentation
- **Graphiques comparatifs** : Visualisations des performances par catégorie
- **Recommandations** : Insights et suggestions d'optimisation basées sur les résultats
- **Méthodologie** : Détails sur les paramètres de test (itérations, warmup, etc.)

**Métriques clés :**
- **Temps moyen (ms)** : Temps d'exécution moyen de l'algorithme
- **RME (%)** : Erreur relative de mesure (plus bas = plus fiable)
- **Wins** : Nombre de tests où l'implémentation est la plus rapide
- **Win %** : Pourcentage de victoires par rapport au total des tests

### Unit Tests

#### Exécution

```bash
# Exécuter tous les tests unitaires
npm test

# Exécuter en mode watch (surveillance des changements)
npm test -- --watch

# Exécuter un fichier de test spécifique
npm test -- tests/string.test.js

# Exécuter les tests en mode verbose
npm test -- --reporter=verbose
```

#### Couverture de code

```bash
# Générer un rapport de couverture
npm run test:coverage

# Le rapport est généré dans le dossier coverage/
# Ouvrir coverage/index.html dans un navigateur pour voir les détails
```

**Seuils de couverture :**
- Lignes : 70%
- Fonctions : 70%
- Branches : 65%
- Statements : 70%

#### Écriture de tests

**Bonnes pratiques :**

- ✅ **Rapidité** : Les tests doivent s'exécuter rapidement pour permettre des tests fréquents
- ✅ **Isolation** : Chaque test doit être indépendant et ne pas dépendre d'autres tests
- ✅ **Répétabilité** : Les tests doivent produire les mêmes résultats à chaque exécution
- ✅ **Auto-vérification** : Les tests doivent vérifier automatiquement leurs résultats
- ✅ **Nommage clair** : Utiliser des noms descriptifs qui expliquent ce qui est testé

**Structure d'un test :**

```javascript
import { describe, it, expect } from "vitest";

describe("nomDuModule", () => {
  it("devrait faire quelque chose de spécifique", () => {
    // Arrange : Préparer les données
    const input = "test";
    
    // Act : Exécuter la fonction
    const result = maFonction(input);
    
    // Assert : Vérifier le résultat
    expect(result).toBe("expected");
  });
});
```

## 📜 Scripts disponibles

### Tests

```bash
npm test                 # Exécuter tous les tests unitaires
npm run test:coverage    # Exécuter avec rapport de couverture
npm run benchmark        # Exécuter les benchmarks de performance
```

### Options supplémentaires

```bash
npm test -- --watch              # Mode watch pour les tests unitaires
npm test -- tests/string.test.js # Exécuter un fichier spécifique
npm test -- --reporter=verbose   # Mode verbose
```

## 🛠️ Technologies

### Frameworks et outils

- **[Vitest](https://vitest.dev/)** : Framework de test rapide et moderne
- **[tinybench](https://github.com/tinylibs/tinybench)** : Bibliothèque de benchmarking
- **[jsdom](https://github.com/jsdom/jsdom)** : Environnement DOM simulé pour les tests de composants
- **[tsx](https://github.com/esbuild-kit/tsx)** : Exécution TypeScript/ESM
- **[chart.js](https://www.chartjs.org/)** : Génération de graphiques pour les rapports
- **[chalk](https://github.com/chalk/chalk)** : Coloration du terminal

### Dépendances principales

**Benchmarks :**
- `tinybench` : Bibliothèque de benchmarking
- `chart.js` et `chartjs-node-canvas` : Génération de graphiques
- `chalk` : Coloration du terminal
- `tsx` : Exécution TypeScript/ESM
- `vitest` : Framework de test

**Unit Tests :**
- `vitest` : Framework de test
- `@vitest/coverage-v8` : Couverture de code
- `jsdom` : Environnement DOM simulé

## 📁 Structure

```text
viteTest/
├── Benchmarks/          # Tests de performance et benchmarking
│   ├── config/          # Configuration et setup
│   ├── data/            # Gestion des données de benchmark
│   ├── implementations/ # Implémentations à comparer
│   ├── reporting/       # Génération des rapports HTML
│   ├── tests/           # Tests de benchmark
│   └── utils/           # Utilitaires pour les benchmarks
│
└── Unit/                # Tests unitaires et de composants
    ├── data/            # Données de test partagées
    ├── helpers/         # Utilitaires de test
    ├── logging/         # Utilitaires de logging pour les tests
    ├── mocks/           # Mocks et wrappers de test
    ├── tests/           # Tests unitaires (composants et utils)
    └── setup.js         # Configuration de test
```

### Structure détaillée Benchmarks

```text
Benchmarks/
├── config/              # Configuration et helpers de test
│   ├── constants.js     # Constantes de configuration
│   ├── setup.js         # Configuration Vitest
│   └── testHelpers.js   # Helpers pour les tests
├── data/                # Collecte et gestion des données
│   ├── collector.js     # Collecte des résultats
│   ├── data.json        # Données de test
│   ├── loader.js        # Chargement des données
│   └── results.js       # Gestion des résultats
├── implementations/     # Implémentations à comparer
│   ├── filtersMap.js    # Implémentation avec Map
│   └── production.js    # Implémentation de production
├── reporting/           # Génération des rapports HTML
│   ├── cli/            # Interface en ligne de commande
│   ├── core/           # Logique principale
│   ├── helpers/        # Utilitaires de formatage
│   ├── sections/       # Sections du rapport
│   └── styles/         # Styles CSS pour les rapports
├── tests/              # Tests de benchmark
│   ├── search.test.js
│   ├── filterByIngredients.test.js
│   ├── filterByAppliances.test.js
│   └── filterByUstensils.test.js
└── utils/              # Utilitaires (formatage, logging, mesure)
    ├── formatting.js
    ├── logging.js
    └── measurement.js
```

### Structure détaillée Unit Tests

```text
Unit/
├── data/               # Données de test et constantes partagées
│   └── testData.js     # Mock data et constantes
├── helpers/            # Utilitaires de test
│   └── utils.js        # Helpers pour dropdown et filterTags
├── logging/            # Utilitaires de logging pour les tests
│   ├── console.js      # Wrapper de logging
│   └── modernConsole.js # Logging moderne avec spinners
├── mocks/              # Mocks et wrappers pour les tests
│   ├── wrappers.js     # Wrappers de compatibilité
│   ├── deliveryImages.js
│   ├── filtersBy.js
│   ├── filtersManager.js
│   ├── searchRender.js
│   └── skeletonsManager.js
├── tests/              # Tests unitaires
│   ├── bodyScroll.test.js
│   ├── cache.test.js
│   ├── cardsRender.test.js
│   ├── deliveryImages.test.js
│   ├── dropdown*.test.js
│   ├── errorHandler.test.js
│   ├── filter*.test.js
│   ├── recipeApi.test.js
│   ├── recipesBuilder.test.js
│   ├── search*.test.js
│   ├── skeletons.test.js
│   ├── scrollToTop.test.js
│   └── string.test.js
└── setup.js            # Configuration globale des tests
```

## 🔗 Path Aliases

Les alias de chemins suivants sont disponibles pour simplifier les imports :

### Benchmarks

```javascript
@benchmarks/*              → viteTest/Benchmarks/*
@benchmarks-config/*       → viteTest/Benchmarks/config/*
@benchmarks-data/*         → viteTest/Benchmarks/data/*
@benchmarks-tests/*        → viteTest/Benchmarks/tests/*
@benchmarks-utils/*        → viteTest/Benchmarks/utils/*
@benchmarks-reporting/*    → viteTest/Benchmarks/reporting/*
```

### Unit Tests

```javascript
@tests/*                   → viteTest/Unit/*
@tests-tests/*             → viteTest/Unit/tests/*
@tests-data/*              → viteTest/Unit/data/*
@tests-helpers/*           → viteTest/Unit/helpers/*
@tests-logging/*           → viteTest/Unit/logging/*
@tests-mocks/*             → viteTest/Unit/mocks/*
```

**Exemple d'utilisation :**

```javascript
import { mockRecipes } from "@tests-data/testData.js";
import { logCategorySummary } from "@tests-logging/console.js";
import { generateReport } from "@benchmarks-reporting/index.js";
```

## 📝 Contribution

### Ajouter un nouveau test unitaire

1. Créer un fichier `*.test.js` dans `Unit/tests/`
2. Importer les dépendances nécessaires
3. Suivre la structure de test recommandée
4. Vérifier que le test passe : `npm test`

### Ajouter un nouveau benchmark

1. Créer un fichier `*.test.js` dans `Benchmarks/tests/`
2. Utiliser `tinybench` pour mesurer les performances
3. Comparer différentes implémentations
4. Exécuter : `npm run benchmark`

## 📄 Licence

Ce projet fait partie du projet LesPetitPlats et suit la même licence que le projet principal.
