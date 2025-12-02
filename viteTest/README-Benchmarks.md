# Benchmarks de Performance

🇬🇧 [English](README-Benchmarks.en.md)

Système de benchmarking pour mesurer et comparer les performances des algorithmes de recherche et de filtrage utilisés dans l'application LesPetitPlats.

## 🎯 À propos

Ce système utilise **Vitest** et **tinybench** pour générer des rapports HTML détaillés avec statistiques, graphiques et recommandations. Les benchmarks permettent de comparer différentes implémentations d'algorithmes pour optimiser les performances de l'application.

## ✨ Fonctionnalités

- ⚡ **Mesure de performance** : Comparaison des performances entre différentes implémentations d'algorithmes
- 📊 **Rapports HTML détaillés** : Génération automatique de rapports avec statistiques, graphiques et visualisations
- 🎯 **Tests ciblés** : Possibilité d'exécuter tous les tests ou de sélectionner des tests spécifiques
- 📈 **Métriques avancées** : Temps moyen, min, max, RME (Relative Measurement Error), taux de victoire
- 💡 **Recommandations** : Insights et suggestions d'optimisation basées sur les résultats
- 🔍 **Tests de performance** : Recherche par terme, filtrage par ingrédients, appareils et ustensiles
- 🔄 **Comparaison d'implémentations** : Production (.map()/.filter()) vs forEach loops
- 💻 **Informations système** : Collecte automatique et affichage des informations système (CPU, mémoire, OS) dans les rapports

## 💻 Utilisation

```bash
# Installer les dépendances (si nécessaire)
npm install

# Exécuter les benchmarks
npm run benchmark
```

**Options :**

- **"yes"** → Tous les tests (rapport `-full`)
  - Inclut les tests "All" qui benchmarkent toutes les valeurs disponibles
  - Peut prendre 5-10 minutes

- **"no"** → Tests sélectionnés (rapport `-partial`)

**Comparaisons :**

- Production (`.map()/.filter()`)
- forEach (boucles forEach)

**Rapports :**

- Générés dans `benchmark-results/Benchmark/` avec timestamp et suffixe `-full` ou `-partial`.
- Contiennent : Résumé exécutif, Statistiques, Graphiques, Recommandations, Méthodologie
- Incluent des informations système détaillées (OS, CPU, architecture, mémoire) collectées automatiquement

**Métriques :**

- Temps moyen (ms)
- RME (%) - erreur relative de mesure
- Wins/Win % - nombre et pourcentage de victoires

## 🛠️ Technologies

- **[Vitest](https://vitest.dev/)** : Framework de test
- **[tinybench](https://github.com/tinylibs/tinybench)** : Bibliothèque de benchmarking
- **[chart.js](https://www.chartjs.org/)** + `chartjs-node-canvas` : Génération de graphiques
- **[systeminformation](https://www.npmjs.com/package/systeminformation)** : Collecte d'informations système détaillées
- **[chalk](https://github.com/chalk/chalk)**, **[ora](https://github.com/sindresorhus/ora)**, **[cli-progress](https://github.com/npkgz/cli-progress)** : Utilitaires terminal

## 📁 Structure

```text
Benchmarks/
├── config/              # Configuration et helpers
│   ├── constants.js
│   └── testHelpers.js
├── data/                # Collecte et gestion des données
│   ├── collector.js
│   ├── data.json
│   ├── loader.js
│   └── results.js
├── implementations/     # Implémentations à comparer
│   ├── production.js    # .map()/.filter()
│   └── forEach.js       # forEach loops
├── reporting/           # Génération des rapports HTML
│   ├── cli/            # Interface CLI (prompts.js)
│   ├── core/           # Logique principale (charts.js, finalizer.js, orchestrator.js, runner.js)
│   ├── helpers/        # Formatage (formatting.js, loadCss.js, markdown.js)
│   ├── sections/       # Sections du rapport (implementation.js, insights.js, keyFindings.js, methodology.js, stats.js, testResults.js)
│   ├── styles/         # Styles CSS (cards.css, layout.css, main.css, markdown.css, responsive.css, tables.css, variables.css)
│   ├── generateHtml.js
│   └── index.js
├── tests/              # Tests de benchmark
│   └── utils/filterEngine/  # Tests de performance
│       ├── search.test.js
│       ├── ingredients.test.js
│       ├── appliances.test.js
│       └── utensils.test.js
├── utils/              # Utilitaires (formatage, mesure)
│   ├── formatting.js
│   └── measurement.js
└── setup.js            # Configuration globale des benchmarks
```

## 🔗 Path Aliases

Les alias de chemins suivants sont disponibles pour simplifier les imports :

```javascript
@benchmarks/*              → viteTest/Benchmarks/*
@benchmarks-config/*       → viteTest/Benchmarks/config/*
@benchmarks-data/*         → viteTest/Benchmarks/data/*
@benchmarks-tests/*        → viteTest/Benchmarks/tests/*
@benchmarks-utils/*        → viteTest/Benchmarks/utils/*
@benchmarks-reporting/*    → viteTest/Benchmarks/reporting/*
@viteTest-helper/*         → viteTest/helper/* (message, console, fileSystem, etc.)
```

## 📄 Licence

Ce projet fait partie du projet LesPetitPlats et suit la même licence que le projet principal.
