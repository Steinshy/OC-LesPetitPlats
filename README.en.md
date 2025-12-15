<div align="center" style="margin: 24px 0;">
  <h1>
    <img src="public/favicons/logoIcon.svg" alt="Les Petits Plats" width="52" height="47" style="vertical-align: middle; margin-right: 12px; background: transparent;">
    Les Petits Plats
  </h1>
  <p>🇫🇷 <a href="README.md">Français</a></p>
  <p>
    Modern web application for searching among over 1500 culinary recipes.<br>
    Intuitive interface with real-time search, advanced filters by ingredients, appliances and utensils, and optimized results display.
  </p>
  <p>
    <img src="public/mockup/mockup.png" alt="Les Petits Plats multi-device preview" width="700" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
  </p>

  <p>
    🚀 <a href="https://steinshy.github.io/OC-LesPetitPlats/" target="_blank"><strong>Access the online application</strong></a>
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
    <img src="https://img.shields.io/badge/tests-passing-brightgreen?style=flat-square&logo=vitest&logoColor=white" alt="Tests">
    <img src="https://img.shields.io/badge/coverage-70%25-yellow?style=flat-square&logo=codecov&logoColor=white" alt="Coverage">
    <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git">
    <img src="https://img.shields.io/badge/GitHub%20Pages-121013?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages">
  </p>
</div>

## 🎯 About

Progressive Web App (PWA) for searching among over 1500 culinary recipes. Instant search, dynamic filtering, caching system, offline mode, and responsive interface optimized for performance.

## ✨ Features

- 🔍 **Real-time search** : Search in names, descriptions, ingredients, and utensils
- 🎛️ **Advanced filtering** : Filters by ingredients, appliances, and utensils with interactive dropdown menus
- 📊 **Results counter** : Dynamic display of the number of recipes found
- 📱 **Responsive design** : Interface adapted to all screen sizes
- 🚀 **PWA** : Can be installed on mobile devices and works offline
- ⚡ **Optimized performance** : Caching system, lazy loading of images, asset optimizations
- 🎨 **Modern interface** : Clean design with Tailwind CSS

## 🚀 Installation

**Prerequisites:** Node.js 18+ and npm 9+

```bash
git clone https://github.com/steinshy/OC-LesPetitPlats.git
cd LesPetitPlats
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## 💻 Usage

### Search and filtering

1. **Text search** : Enter a term in the search bar (recipe name, ingredient, etc.)
2. **Category filters** : Use the dropdown menus to filter by :
   - Ingredients
   - Appliances
   - Utensils
3. **Active filters** : Selected filters appear below the menus with the option to remove them
4. **Combination** : Text search and filters can be combined to refine results

## 📜 Available scripts

### Development

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview the build

### Code quality

- `npm run lint` - Code verification (ESLint, Stylelint, HTML, Markdown)
- `npm run lint:fix` - Automatic ESLint fixes
- `npm run format` - Code formatting with Prettier

### Tests

- `npm run test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report

### Analysis & Optimization

- `npm run analyze` - Bundle analysis
- `npm run lighthouse` - Lighthouse report
- `npm run benchmark` - Generate performance benchmark reports
- `npm run jsben` - Generate benchmark files for jsben.ch
- `npm run optimize:images` - Optimize images

### Utilities

- `npm run clean` - Clean build folders
- `npm run generate:pwa-assets` - Generate PWA assets

## 🛠️ Technologies

- **Vite 7** - Build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **PWA** - Progressive Web App with Service Worker
- **Neverthrow** - Functional error handling
- **Query String** - URL parameter management
- **Vitest** - Unit testing framework
- **tinybench** - Benchmarking library
- **systeminformation** - Detailed system information collection for performance reports

**Code quality:** ESLint, Stylelint, HTML Validate, Prettier

```bash
npm run lint          # Code verification
npm run lint:fix      # Automatic fixes
npm run format        # Automatic formatting
```

## 🏗️ Architecture & Design Decisions

### Feature Investigation: Search Engine

To differentiate the application from other recipe platforms, a fluid and performant search engine was developed. The goal is to display in real-time recipes matching user input, with filters that adapt dynamically.

#### UML Documentation

Detailed UML diagrams describe the architecture and filtering strategies:

- 📄 [Feature Investigation Document.pdf](Fiche%20d%E2%80%99investigation%20fonctionnalit%C3%A9.pdf) - Complete analysis of approaches
- 📊 [Application Architecture](public/uml/en/applicationArchitecture.png) - Structural view and lifecycle phases
- 🔄 [Method 1 - Native Loops](public/uml/en/method1-forEach.png) - Imperative approach
- ⚡ [Method 2 - Production](public/uml/en/method2-Production.png) - Declarative approach (implemented)
- 📈 [Runtime Data Flow](public/uml/en/runtimeDataFlow.png) - Event-driven processing

## 📊 Performance & Tests

For more information:

- [viteTest/README-Benchmarks.md](viteTest/README-Benchmarks.md) - Performance benchmarks
- [viteTest/README-Unit.md](viteTest/README-Unit.md) - Unit tests
- [viteTest/README-Jsben.md](viteTest/README-Jsben.md) - Benchmarks with jsben.ch

## 📁 Project structure

```text
LesPetitPlats/
├── public/              # Static files (api/, favicons/, recipes/, sw.js)
├── src/
│   ├── App.js          # Entry point
│   ├── components/     # Modular UI components
│   │   ├── cards/      # Recipe display (manager, render, setup, ui)
│   │   ├── dropdowns/  # Dropdown menus (data, elements, interactions, manager, render, setup)
│   │   ├── filters/    # Modular filtering system
│   │   │   ├── elements.js    # DOM selectors
│   │   │   ├── engine.js      # Filtering logic (extraction, search)
│   │   │   ├── interactions.js # Event handlers
│   │   │   ├── pipeline.js    # Filtering pipeline orchestration
│   │   │   ├── render.js      # Rendering functions (tags)
│   │   │   ├── setup.js       # Initialization
│   │   │   ├── state.js       # State management
│   │   │   └── ui.js          # UI updates (tags, counters)
│   │   ├── search/     # Search bar (elements, manager, setup)
│   │   └── skeletons/  # Loading placeholders (manager, renderer, setup)
│   └── utils/          # Utilities (cache, eventBus, normalize, recipeApi, etc.)
├── styles/             # CSS styles (base, components, global, utilities)
├── scripts/            # Utility scripts (analyze, export, lighthouse)
```

## 📄 License

Project created as part of the OpenClassrooms Web Developer program.

---
