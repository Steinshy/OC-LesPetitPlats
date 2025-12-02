# Comment créer des benchmarks sur jsben.ch

🇬🇧 [English](README-Jsben.en.md)

Ce guide explique comment benchmarker vos implémentations `production.js` vs `forEach.js` sur [jsben.ch](https://jsben.ch/).

## Démarrage rapide

1. **Exécuter le script de génération** :

   ```bash
   npm run jsben
   ```

   Cela génère des fichiers de benchmark dans `benchmark-results/Jsben/` avec 4 types de benchmarks :
   - `search/` - Filtrage par terme de recherche
   - `ingredients/` - Filtrage par ingrédients
   - `appliances/` - Filtrage par appareils
   - `utensils/` - Filtrage par ustensiles

2. **Ouvrir jsben.ch** : Allez sur <https://jsben.ch/> et cliquez sur "Create New Test"

3. **Copier et coller** depuis le dossier de benchmark choisi :

   - `setup.js` → Coller dans la boîte "Setup"
   - `test-production.js` → Coller dans la première boîte de test
   - `test-forEach.js` → Coller dans la deuxième boîte de test

4. **Exécuter le test** et partager l'URL

## Fichiers générés

Chaque dossier de benchmark contient :

- `setup.js` - Code de configuration pour jsben.ch
- `test-production.js` - Implémentation de production (.map()/.filter())
- `test-forEach.js` - Implémentation forEach
- `README.md` - Instructions spécifiques

## Comprendre les résultats

- **Score plus élevé = Plus rapide** : L'implémentation avec le score le plus élevé est plus rapide
- **Différence en pourcentage** : Affiche la différence de performance entre les implémentations
- **Cohérence** : Plusieurs exécutions aident à garantir des résultats cohérents

## Conseils

- **Données réalistes** : Le générateur utilise 50 recettes de vos données réelles
- **Exécuter plusieurs fois** : jsben.ch exécute automatiquement plusieurs itérations
- **Sauvegarder les URL** : Marquez les URL de benchmark pour référence future
- **Jeux de données plus grands** : Pour les benchmarks manuels, utilisez 50-100+ recettes pour la précision

## 📁 Structure

```text
Jsben/
├── setup.js            # Point d'entrée principal - génère les fichiers de benchmark
└── benchmarks/         # Générateurs de code pour chaque type de benchmark
    ├── search.js       # Générateur pour les tests de recherche
    ├── ingredients.js  # Générateur pour les tests de filtrage par ingrédients
    ├── appliances.js   # Générateur pour les tests de filtrage par appareils
    └── utensils.js     # Générateur pour les tests de filtrage par ustensiles
```

**Fichiers générés** (dans `benchmark-results/Jsben/`) :

```text
benchmark-results/Jsben/
├── search/             # Benchmark de recherche
│   ├── setup.js
│   ├── test-production.js
│   ├── test-forEach.js
│   └── README.md
├── ingredients/        # Benchmark de filtrage par ingrédients
│   ├── setup.js
│   ├── test-production.js
│   ├── test-forEach.js
│   └── README.md
├── appliances/         # Benchmark de filtrage par appareils
│   ├── setup.js
│   ├── test-production.js
│   ├── test-forEach.js
│   └── README.md
└── utensils/           # Benchmark de filtrage par ustensiles
    ├── setup.js
    ├── test-production.js
    ├── test-forEach.js
    └── README.md
```

## 🔗 Path Aliases

Les alias de chemins suivants sont disponibles pour simplifier les imports :

```javascript
@jsben/*                → viteTest/Jsben/*
@viteTest-helper/*      → viteTest/helper/* (message, console, fileSystem, jsben, cleanup, paths)
```
