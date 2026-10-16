# LesPetitPlats — Recipe Search & Discovery SPA

**Type:** Frontend Single Page Application

---

## 🎯 Project Overview

LesPetitPlats is an OpenClassrooms learning project demonstrating:
- Modern vanilla JavaScript with ES modules
- Search & filtering algorithms
- Client-side state management with EventBus pattern
- Performance optimization (caching, LRU strategy)
- URL-based state management
- Responsive design with Tailwind CSS
- Build optimization with Vite

### Key Objectives
- Implement complex search/filter logic
- Optimize performance with caching strategies
- Master ES modules and modern JavaScript
- Handle URL state synchronization
- Create responsive, accessible UI with Tailwind

---

## 🏗️ Architecture Overview

```
LesPetitPlats/
├── src/
│   ├── App.js              # Main application entry
│   ├── components/         # Feature modules
│   ├── utils/              # Utilities & helpers
│   └── (no /pages - single page app)
├── styles/                 # Tailwind + custom CSS
├── public/                 # Static assets
├── dist/                   # Production build (GitHub Pages)
└── vite.config.js          # Build configuration
```

### Application Architecture

**Entry Point:** `src/App.js`
- Single HTML file (`index.html`) with `<div id="root">`, loads `src/App.js` as a module
- Vite manages HMR (Hot Module Reloading) in dev
- No framework routing (single page)

**State Management:**
- **EventBus pattern** – Module-level `eventBus` (`on`, `off`, `emit`) in `src/utils/eventBus.js`
- **URL state** – Search and filter values written to the query string with `history.pushState` (`src/utils/urlState.js`)
- **LRU cache** – `tiny-lru` store in `src/utils/cache.js` caches the recipes fetch

**Data Flow:**
```
User Input (search box or dropdown item)
  ↓
Component emits an event via eventBus (filters:searchChanged, dropdown:itemToggled)
  ↓
filtersPipeline.apply() updates filtersState and filtersState.filtered
  ↓
updateURLState() / clearURLState() update the query params (urlState.js)
  ↓
eventBus.emit("filters:updated") → cards, dropdowns and filter UI re-render
```

**Directory Structure:**

```
src/
├── App.js                    # Bootstrap application
├── components/               # Feature modules (8 modules)
│   ├── filters/             # Filter state, engine, pipeline, render, UI
│   ├── dropdowns/           # Filter dropdowns (data, render, interactions)
│   ├── cards/               # Recipe card rendering (manager, render, ui)
│   ├── search/              # Search input & logic (manager, elements, setup)
│   ├── skeletons/           # Loading placeholders (manager, renderer)
│   ├── hero.js, resultsCounter.js
│   └── scroll.js            # Scroll behavior utilities
│
└── utils/                    # Utility modules
    ├── recipeApi.js         # Fetch recipe data (cached)
    ├── recipesBuilder.js    # Data transformation pipeline
    ├── cache.js             # LRU cache wrapper
    ├── eventBus.js          # Global event dispatcher
    ├── urlState.js          # URL query param management
    ├── normalize.js         # String normalization & filter labels
    └── config.js            # App configuration & small helpers

styles/
├── base.css                 # Base typography, reset, CSS variables
├── components.css           # Component styles (primary)
├── animation.css            # Keyframes (tag fade-in, skeleton shimmer)
├── skeletons.css            # Skeleton loader styles
├── utilities.css            # Utility classes (.sr-only)
└── global.css               # Tailwind imports & layer order
```

---

## 🚀 Development Setup

### Prerequisites
- Node.js 20+ (as in README and CI)
- pnpm 10+ (`packageManager` pins `pnpm@10.33.0`)

### Installation
```bash
pnpm install
pnpm run dev        # Start dev server (Vite, port 5173)
pnpm run build      # Production build → dist/
pnpm run preview    # Preview production build locally
```

### Development Scripts
```bash
pnpm run dev            # Vite dev server with HMR (kills other vite processes first)
pnpm run build          # Production build to dist/
pnpm run preview        # Local preview of the production build
pnpm run lint           # ESLint + Stylelint + html-validate
pnpm run lint:eslint    # ESLint only
pnpm run lint:css       # Stylelint only
pnpm run lint:html      # html-validate (never fails: `|| true`)
pnpm run lint:fix       # ESLint with --fix
pnpm run format         # Prettier on src/**/*.{js,css,html}
pnpm run clean          # Remove dist/ and node_modules/.vite
pnpm run update:check   # List dependency updates (npm-check-updates)
```

---

## 🏛️ Key Architectural Patterns

### 1. EventBus Pattern (Global State Management)

No Redux/Context – instead, a simple EventBus for decoupled components.
`emit` does nothing when no handler is registered.

```javascript
// src/utils/eventBus.js
export const eventBus = {
  events: {},
  on(event, handler) { /* ... */ },
  off(event, handler) { /* ... */ },
  emit(event, payload) {
    if (!this.events[event]) return;
    for (const handler of this.events[event]) {
      handler(payload);
    }
  },
};

// Usage: cards/setup.js
eventBus.on("filters:updated", onFiltersUpdated);
```

Events in use: `filters:updated`, `filters:searchChanged`, `dropdown:itemToggled`, `dropdown:opened`, `dropdown:closed`.

### 2. URL State Management

Search & filters synced to URL query params for shareable links:

- `parseURLState()` reads `search`, `ingredients`, `appliances` and `utensils` (comma-separated) on startup and on `popstate`.
- `updateURLState(state)` writes them with `window.history.pushState`; `clearURLState()` resets to the bare pathname when no filter is active.

### 3. LRU Caching

Performance optimization – avoid redundant API calls:

```javascript
// src/utils/cache.js
export const appCache = lru(MAX_ITEMS); // MAX_ITEMS = 500

export const cacheGetOrSet = async (key, fetcher, ttlMs) => {
  const cached = cacheGet(key);
  if (cached !== undefined) {
    return cached;
  }
  const result = await fetcher();
  cacheSet(key, result, ttlMs);
  return result;
};
```

`fetchRecipes()` (`src/utils/recipeApi.js`) caches the recipes under `recipes_v1`; entries expire after 5 minutes (`DEFAULT_TTL_MS`).

### 4. Data Normalization

Raw API response → Structured format:

```javascript
// src/utils/recipesBuilder.js
const transformRecipes = apiRecipesData =>
  apiRecipesData.map(recipe => {
    const images = buildImages(recipe);

    return {
      id: recipe?.id || 0,
      // ...
      utensils: recipe?.ustensils || [],
      appliance: recipe?.appliance || "",
      images,
    };
  });
```

Strings used for search and filter matching go through `normalizeString()` in `src/utils/normalize.js` (strips parenthesised text and accents, lowercases).

---

## 🎨 Styling Architecture

**Framework:** Tailwind CSS v4 (`tailwindcss` with `@tailwindcss/vite`), imported via `styles/global.css`

**CSS Files by Concern:**
- `base.css` – Typography, reset, CSS custom properties
- `components.css` – Component-scoped styles (largest file ~54KB)
- `animation.css` – Keyframes (`tag-fade-in`, `skeleton-shimmer`)
- `skeletons.css` – Loading placeholder styles
- `utilities.css` – Custom utility classes (`.sr-only`)
- `global.css` – Tailwind imports and layer order (`theme, base, components, skeletons, utilities`)

**CSS Organization:**
```css
/* styles/base.css */
:root {
  --color-bg: #ededed;
  --color-primary: #f2d267;
  --color-dark: #181818;
}
```

---

## 🔍 Search & Filter Algorithm

### Filter Logic
```javascript
// src/components/filters/engine.js
onFilter(recipes, selectedValues, type) {
  // ...
  return recipes.filter(recipe => {
    const values = extractMethod(recipe);
    return selected.every(v => values.includes(normalizeString(v)));
  });
},
```

- Filter types: `ingredients`, `appliances`, `utensils` (multi-select, no cuisine filter)
- Algorithm: AND logic – a recipe must contain every selected value of a type, and match every active type (`applyAll`)

### Search Algorithm
- **Single search box:** normalized (case- and accent-insensitive) substring match over name, description, appliance, ingredient names and utensils (`buildSearchText` / `onSearch` in `filters/engine.js`)
- **Real-time:** input is debounced by 120 ms (`search/setup.js`)

---

## 📚 Dependencies

### Main Dependencies
- `@tailwindcss/vite` – Tailwind CSS integration
- `tailwindcss` – Tailwind CSS v4
- `remixicon` – Icon library
- `query-string` – URL query parsing
- `tiny-lru` – LRU cache utility

### Dev Dependencies
- `vite` – Build tool
- `eslint` – Linting (with plugins: html, import, jsdoc, security, sonarjs, unicorn; TypeScript import resolver)
- `prettier` – Code formatting (with `prettier-plugin-tailwindcss`)
- `stylelint` – CSS linting (with `stylelint-config-standard`, `stylelint-order`)
- `html-validate` – HTML validation
- `vite-plugin-compression` – gzip/brotli compression
- `vite-plugin-webfont-dl` – Self-hosted fonts
- `vite-tsconfig-paths` – Resolves the `@components`, `@utils`, `@styles` aliases from `tsconfig.json`
- `npm-check-updates` – `update:*` scripts

---

## 🚀 Production Build

### Build Output
- **Path:** `dist/` (deployed to GitHub Pages by `.github/workflows/deploy.yml`)
- **Base path:** `/OC-LesPetitPlats/` by default; `BASE_PATH` overrides it, and `deploy.yml` sets it from the repository name
- **Optimizations:**
  - Minification (ESBuild), `console` calls dropped in production
  - CSS minification (Lightning CSS)
  - gzip and brotli (`.gz` / `.br`) files
  - Tree-shaking
  - Vendor chunk splitting (`vendor-tailwind`, `vendor-cache`, `vendor-utils`, `vendor-icons`, `vendor`)

### Build Process (vite.config.js)
```javascript
// Non-development builds: webfont download, gzip + brotli compression
// Custom rollup plugins: drop remixicon .svg and legacy fonts, optimize-svg
// Code splitting: manualChunks separates node_modules into vendor chunks
// CSS: cssMinify "lightningcss"
```

---

## 🧪 Testing Strategy

**Framework:** None built-in (vanilla JS)
**Manual Testing Areas:**
- ✅ Search functionality (empty, partial, full matches)
- ✅ Filter combinations (AND logic)
- ✅ Cache hits/misses (dev tools)
- ✅ URL state persistence (refresh page, share link)
- ✅ Mobile responsiveness (viewport changes)
- ✅ Accessibility (ARIA, keyboard navigation)

**Performance Testing:**
```bash
pnpm run build         # Check bundle size
pnpm run preview       # Profile production build
# Lighthouse audit in browser DevTools
```

---

## 🔗 Data API

**Source:** Static JSON file (50 recipes, a top-level array)
**Location:** `public/api/data.json` (fetched by `fetchRecipes()` in `src/utils/recipeApi.js`)
**Structure:**
```javascript
[
  {
    id: number,
    image: string,                    // file name, e.g. "Recette01.jpg"
    name: string,
    servings: number,
    ingredients: [{ ingredient: string, quantity?: number, unit?: string }],
    time: number,                     // minutes
    description: string,
    appliance: string,
    ustensils: string[]               // mapped to `utensils` in recipesBuilder.js
  }
]
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Filters not working | Check `filters:updated` subscriptions (`eventBus.on` / `eventBus.off`) in components |
| Cache not updating | `appCache` is module-private (not on `window`); reload the page or wait for the 5-minute TTL |
| URL state mismatch | Verify `urlState.js` reads/writes correct params (`search`, `ingredients`, `appliances`, `utensils`) |
| Slow searches | Check filter cost in `filters/engine.js`; the search input is already debounced (120 ms) |
| Build too large | Check the compressed size report printed by `pnpm run build` (`reportCompressedSize`) |

---

## 📖 Key Files to Understand

- `src/App.js` – Application bootstrap & initialization
- `src/utils/eventBus.js` – Global event system
- `src/utils/urlState.js` – URL query param sync
- `src/utils/recipesBuilder.js` – Data transformation
- `src/components/search/manager.js` – Search input UI sync (matching logic is in `src/components/filters/engine.js`)
- `src/components/filters/` – Filter state, engine, pipeline and UI
- `vite.config.js` – Build configuration

---

## 💡 Quick Reference

| What | Where |
|------|-------|
| Add new filter | `extract` in `src/components/filters/engine.js` + `dropdownsLabels` in `src/components/dropdowns/setup.js` |
| Modify search algorithm | `src/components/filters/engine.js` (`buildSearchText`, `onSearch`) |
| Change styling | `styles/components.css` (main) |
| Add new recipe field | `public/api/data.json` + map it in `transformRecipes` (`src/utils/recipesBuilder.js`) |
| Optimize bundle | `pnpm run build` → check the size report |
