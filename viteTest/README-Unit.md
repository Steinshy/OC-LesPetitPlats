# Tests Unitaires

🇬🇧 [English](README-Unit.en.md)

Tests unitaires et de composants pour valider le comportement fonctionnel de l'application LesPetitPlats et garantir la qualité du code.

## 🎯 À propos

Ce système utilise **Vitest** comme framework de test pour assurer la couverture de code et la validation fonctionnelle. Les tests unitaires permettent de valider le comportement des composants et utilitaires de l'application.

## ✨ Fonctionnalités

- ✅ **Tests unitaires** : Validation du comportement fonctionnel des composants et utilitaires
- 🎭 **Tests de composants** : scrollLock, cards, dropdown, filters, search, skeletons, scrollToTop
- 🔧 **Tests d'utilitaires** : cache, imageTracker, toast, recipeApi, recipesBuilder, normalize
- 📊 **Couverture de code** : Rapports de couverture avec seuils configurables
- 🔄 **Mode watch** : Exécution en temps réel lors des modifications
- 🎪 **Mocks et helpers** : Infrastructure complète pour les tests avec mocks et utilitaires

## 💻 Utilisation

```bash
# Exécuter tous les tests
npm test

# Mode watch (surveillance des changements)
npm test -- --watch

# Fichier spécifique
npm test -- tests/normalize.test.js

# Générer un rapport de couverture
npm run test:coverage
# Rapport disponible dans benchmark-results/Unit/index.html
```

**Seuils de couverture :** Lignes 70%, Fonctions 70%, Branches 65%, Statements 70%

## Écriture de tests

**Bonnes pratiques :** Rapidité, Isolation, Répétabilité, Auto-vérification, Nommage clair

**Structure :**

```javascript
import { describe, it, expect } from "vitest";

describe("nomDuModule", () => {
  it("devrait faire quelque chose de spécifique", () => {
    const input = "test";
    const result = maFonction(input);
    expect(result).toBe("expected");
  });
});
```

## 🛠️ Technologies

- **[Vitest](https://vitest.dev/)** : Framework de test rapide et moderne
- **[jsdom](https://github.com/jsdom/jsdom)** : Environnement DOM simulé pour les tests de composants
- `@vitest/coverage-v8` : Couverture de code

## 📁 Structure

```text
Unit/
├── data/               # Données de test et constantes partagées
│   └── data.js
├── helpers/            # Utilitaires de test
│   └── utils.js
├── mocks/              # Mocks et wrappers pour les tests
│   ├── components/     # Mocks de composants
│   │   ├── filters/manager.js
│   │   └── search/render.js
│   ├── utils/          # Mocks d'utilitaires
│   │   ├── filterEngine.js
│   │   └── imageTracker.js
│   └── wrappers.js
├── tests/              # Tests unitaires organisés par structure
│   ├── components/     # Tests de composants
│   │   ├── cards/render.test.js
│   │   ├── dropdowns/  # data.test.js, manager.test.js, render.test.js
│   │   ├── filters/tags.test.js
│   │   ├── search/     # manager.test.js, render.test.js, search.test.js
│   │   ├── skeletons/manager.test.js
│   │   ├── scrollLock.test.js
│   │   └── scrollToTop.test.js
│   └── utils/          # Tests d'utilitaires
│       ├── cache.test.js
│       ├── filterEngine.test.js
│       ├── imageTracker.test.js
│       ├── normalize.test.js
│       ├── recipeApi.test.js
│       ├── recipesBuilder.test.js
│       └── toast.test.js
└── setup.js            # Configuration globale des tests
```

## 🔗 Path Aliases

Les alias de chemins suivants sont disponibles pour simplifier les imports :

```javascript
@tests/*                   → viteTest/Unit/*
@tests-tests/*             → viteTest/Unit/tests/*
@tests-data/*              → viteTest/Unit/data/*
@tests-helpers/*           → viteTest/Unit/helpers/*
@tests-mocks/*             → viteTest/Unit/mocks/*
@viteTest-helper/*         → viteTest/helper/* (message, console, fileSystem, etc.)
```

## 📝 Contribution

Pour ajouter un nouveau test : créer `*.test.js` dans `Unit/tests/`, suivre la structure recommandée, exécuter `npm test`

## 📄 Licence

Ce projet fait partie du projet LesPetitPlats et suit la même licence que le projet principal.
