# Les Petits Plats

Application web de recettes faciles et délicieuses avec moteur de recherche performant.

## Aperçu

Les Petits Plats est une plateforme de recherche de recettes de cuisine offrant une recherche rapide et intuitive parmi plus de 1500 recettes. L'application propose un système de filtrage avancé par ingrédients, appareils et ustensiles.

## Fonctionnalités

- Recherche de recettes en temps réel avec debouncing
- Filtrage par ingrédients, appareils et ustensiles
- Affichage de cartes de recettes avec images
- Compteur de résultats dynamique
- Menu mobile responsive
- Gestion d'erreurs et états de chargement
- Cache des données pour optimiser les performances

## Technologies

- Vite
- Tailwind CSS
- Vitest
- ESLint
- Prettier
- PWA Ready

## Installation

```bash
npm install
```

## Scripts disponibles

| Commande                  | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `npm run dev`             | Lance le serveur de développement                        |
| `npm run build`           | Build de production                                      |
| `npm test`                | Lance les tests avec couverture et analyse du bundle     |
| `npm run test:ui`         | Interface UI pour les tests                              |
| `npm run lint`            | Vérifie le code avec ESLint, Stylelint, HTML et Markdown |
| `npm run lint:fix`        | Corrige automatiquement les erreurs ESLint               |
| `npm run format`          | Formate le code avec Prettier                            |
| `npm run clean`           | Nettoie les dossiers dist, .vite et coverage             |
| `npm run optimize:images` | Optimise les images                                      |
| `npm run lighthouse`      | Génère un rapport Lighthouse en JSON (nécessite jq)      |

## Structure du projet

```
LesPetitPlats/
├── src/
│   ├── App.js                    # Point d'entrée principal
│   ├── card.js                   # Génération des cartes de recettes
│   ├── search.js                 # Logique de recherche
│   ├── mobileMenu.js             # Gestion du menu mobile
│   ├── errorHandler.js           # Gestion des erreurs
│   ├── components/
│   │   ├── renderHeaderImage.js  # Rendu de l'image header
│   │   └── skeletons.js          # Composants de chargement
│   └── utils/
│       ├── cache.js               # Système de cache
│       ├── recipesBuilder.js     # Construction des données recettes
│       └── deliveryImages.js     # Gestion des images
├── styles/
│   ├── global.css                # Styles principaux
│   └── skeletons.css             # Styles des skeletons
├── public/
│   ├── api/
│   │   └── data.json             # Base de données des recettes
│   └── recipes/                  # Images des recettes
└── viteTest/                     # Tests unitaires
```

## Développement

```bash
npm run dev
```

## Tests

```bash
npm test
```

## Configuration

### Linting

- ESLint
- Stylelint
- html-validate
- markdownlint
- Prettier

### Build

- Vite
- Tailwind CSS

## Lighthouse

### Prérequis

Pour utiliser le script Lighthouse, vous devez installer `jq` (processeur JSON en ligne de commande) :

```bash
# macOS
brew install jq

# Linux (Ubuntu/Debian)
sudo apt-get install jq

# Windows (avec Chocolatey)
choco install jq
```

### Utilisation

1. **Démarrer le serveur de développement :**
   ```bash
   npm run dev
   ```

2. **Dans un autre terminal, lancer Lighthouse :**
   ```bash
   npm run lighthouse
   ```

Le script génère deux fichiers :
- `lighthouse-report.json` - Rapport JSON brut
- `lighthouse-report-formatted.json` - Rapport JSON formaté (lisible)

### Options du rapport

Le rapport Lighthouse inclut :
- **Performance** - Métriques de performance
- **Accessibility** - Accessibilité
- **Best Practices** - Bonnes pratiques
- **SEO** - Optimisation pour les moteurs de recherche

### Analyser le rapport

Pour extraire des informations spécifiques du rapport :

```bash
# Score de performance
jq '.categories.performance.score' lighthouse-report.json

# Tous les audits échoués
jq '.audits | to_entries | map(select(.value.score < 1))' lighthouse-report.json

# Liste des opportunités d'amélioration
jq '.audits | to_entries | map(select(.value.details.type == "opportunity"))' lighthouse-report.json
```

## Licence

Projet réalisé dans le cadre du parcours Développeur Web d'OpenClassrooms.
