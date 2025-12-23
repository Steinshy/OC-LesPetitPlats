<div align="center" style="margin: 24px 0;">
  <h1>
    <img src="public/favicons/logoIcon.svg" alt="Les Petits Plats" width="52" height="47" style="vertical-align: middle; margin-right: 12px; background: transparent;">
    Les Petits Plats
  </h1>
  <p>🇬🇧 <a href="README.en.md">English</a></p>
  <p>
    Application web moderne permettant de rechercher parmi plus de 1500 recettes culinaires.<br>
    Interface intuitive avec recherche en temps réel, filtres avancés par ingrédients, appareils et ustensiles, et affichage optimisé des résultats.
  </p>
  <p>
    <img src="public/mockup/mockup.png" alt="Aperçu multi-appareils de Les Petits Plats" width="700" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
  </p>

  <p>
    🚀 <a href="https://steinshy.github.io/OC-LesPetitPlats/" target="_blank"><strong>Accéder à l'application en ligne</strong></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm">
    <img src="https://img.shields.io/badge/Node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/PWA-enabled-4285F4?style=flat-square&logo=progressive-web-app&logoColor=white" alt="PWA">
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS">
    <img src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000" alt="JavaScript">
  </p>
  <p>
    <img src="https://img.shields.io/github/actions/workflow/status/steinshy/OC-LesPetitPlats/ci.yml?branch=dev&style=flat-square&label=CI" alt="CI">
    <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git">
    <img src="https://img.shields.io/badge/GitHub%20Pages-121013?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages">
  </p>
</div>

## 🎯 À propos

Progressive Web App (PWA) permettant de rechercher parmi plus de 1500 recettes culinaires. Recherche instantanée, filtrage dynamique, système de cache, mode hors ligne et interface responsive optimisée pour les performances.

## ✨ Fonctionnalités

- 🔍 **Recherche en temps réel** : Recherche dans les noms, descriptions, ingrédients et ustensiles
- 🎛️ **Filtrage avancé** : Filtres par ingrédients, appareils et ustensiles avec menus déroulants interactifs
- 📊 **Compteur de résultats** : Affichage dynamique du nombre de recettes trouvées
- 📱 **Design responsive** : Interface adaptée à tous les écrans
- ⚡ **Performance optimisée** : Système de cache, lazy loading des images, optimisations des assets
- 🎨 **Interface moderne** : Design épuré avec Tailwind CSS

## 🚀 Installation

**Prérequis :** Node.js 18+ et npm 9+

```bash
git clone https://github.com/steinshy/OC-LesPetitPlats.git
cd LesPetitPlats
npm install
npm run dev
```

L'application sera accessible à `http://localhost:5173`.

## 💻 Utilisation

### Recherche et filtrage

1. **Recherche par texte** : Saisissez un terme dans la barre de recherche (nom de recette, ingrédient, etc.)
2. **Filtres par catégorie** : Utilisez les menus déroulants pour filtrer par :
   - Ingrédients
   - Appareils
   - Ustensiles
3. **Filtres actifs** : Les filtres sélectionnés apparaissent sous les menus avec possibilité de les retirer
4. **Combinaison** : Recherche textuelle et filtres peuvent être combinés pour affiner les résultats

## 📜 Scripts disponibles

### Développement

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build

### Qualité du code

- `npm run lint` - Vérification du code (ESLint, Stylelint, HTML, Markdown)
- `npm run lint:fix` - Correction automatique ESLint
- `npm run format` - Formatage du code avec Prettier

### Utilitaires

- `npm run clean` - Nettoyage des dossiers de build

## 🛠️ Technologies

- **Vite 7** - Build tool et serveur de développement
- **Tailwind CSS 4** - Framework CSS utility-first
- **Query String** - Gestion des paramètres d'URL

**Qualité du code :** ESLint, Stylelint, HTML Validate, Prettier

```bash
npm run lint          # Vérification du code
npm run lint:fix      # Correction automatique
npm run format        # Formatage automatique
```

## 🏗️ Architecture & Décisions de conception

### Investigation de fonctionnalité : Moteur de recherche

Pour différencier l'application des autres plateformes de recettes, un moteur de recherche fluide et performant a été développé. L'objectif est d'afficher en temps réel les recettes correspondant à la saisie de l'utilisateur, avec des filtres qui s'adaptent dynamiquement.

#### Documentation UML

Des diagrammes UML détaillent l'architecture et les stratégies de filtrage :

- 📄 [Fiche d'investigation fonctionnalité.pdf](Fiche%20d%E2%80%99investigation%20fonctionnalit%C3%A9.pdf) - Analyse complète des approches
- 📊 [Architecture de l'application](public/uml/fr/applicationArchitecture.png) - Vue structurelle et phases du cycle de vie
- 🔄 [Méthode 1 - Boucles natives](public/uml/fr/method1-forEach.png) - Approche impérative
- ⚡ [Méthode 2 - Production](public/uml/fr/method2-Production.png) - Approche déclarative (implémentée)
- 📈 [Flux de données à l'exécution](public/uml/fr/runtimeDataFlow.png) - Traitement piloté par événements

## 📁 Structure du projet

```text
LesPetitPlats/
├── public/              # Fichiers statiques (api/, favicons/, recipes/)
├── src/
│   ├── App.js          # Point d'entrée
│   ├── components/     # Composants UI modulaires
│   │   ├── cards/      # Affichage des recettes (manager, render, setup, ui)
│   │   ├── dropdowns/  # Menus déroulants (data, elements, interactions, manager, render, setup)
│   │   ├── filters/    # Système de filtrage modulaire
│   │   │   ├── elements.js    # Sélecteurs DOM
│   │   │   ├── engine.js      # Logique de filtrage (extraction, recherche)
│   │   │   ├── interactions.js # Gestionnaires d'événements
│   │   │   ├── pipeline.js    # Orchestration du pipeline de filtrage
│   │   │   ├── render.js      # Fonctions de rendu (tags)
│   │   │   ├── setup.js       # Initialisation
│   │   │   ├── state.js       # Gestion de l'état
│   │   │   └── ui.js          # Mises à jour UI (tags, compteurs)
│   │   ├── search/     # Barre de recherche (elements, manager, setup)
│   │   └── skeletons/  # Placeholders de chargement (manager, renderer, setup)
│   └── utils/          # Utilitaires (cache, eventBus, normalize, recipeApi, etc.)
├── styles/             # Styles CSS (base, components, global, utilities)
```

## 📄 Licence

Projet réalisé dans le cadre du parcours Développeur Web d'OpenClassrooms.

---
