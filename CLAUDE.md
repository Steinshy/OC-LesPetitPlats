# LesPetitPlats

OpenClassrooms project: recipe search SPA in vanilla JS (ES modules), Vite, Tailwind CSS v4. Data is a static `public/api/data.json` (50 recipes). No test framework.

## Commands

- `pnpm run dev`: Vite on :5173 (kills other vite processes first); `build` writes `dist/`; `preview` serves it.
- `pnpm run lint`: ESLint + Stylelint + html-validate (the HTML step never fails: `|| true`); `lint:fix`, `format` (Prettier on `src/`), `clean`.
- Node 20+, pnpm 10+ (`packageManager` pins `pnpm@10.33.0`).

## Architecture

- `src/App.js` bootstraps; `src/components/` holds `filters/`, `dropdowns/`, `cards/`, `search/`, `skeletons/`; `src/utils/` holds the shared modules; CSS is in `styles/` (`global.css` sets the layer order).
- State flow: components emit on `eventBus` (`src/utils/eventBus.js`) → `filtersPipeline.apply()` updates `filtersState` → `urlState.js` writes the query string → `filters:updated` re-renders cards, dropdowns and filters. Events: `filters:updated`, `filters:searchChanged`, `dropdown:itemToggled`, `dropdown:opened`, `dropdown:closed`.
- URL state: `search`, `ingredients`, `appliances`, `utensils` (comma-separated), read on startup and `popstate`, written with `pushState`.
- Cache: `tiny-lru` in `src/utils/cache.js`; `fetchRecipes()` caches under `recipes_v1` with a 5-minute TTL.
- Matching: `filters/engine.js`; AND logic across selected values and across types; strings go through `normalizeString()` (accent- and case-insensitive); search is debounced 120 ms.

## Rules

- The API field `ustensils` is mapped to `utensils` in `recipesBuilder.js`; a new recipe field needs the JSON plus `transformRecipes`.
- A new filter needs `extract` in `filters/engine.js` and `dropdownsLabels` in `dropdowns/setup.js`.
- Style in `styles/components.css` (main file); theme variables are in `base.css`.
- Build base path is `/OC-LesPetitPlats/` unless `BASE_PATH` is set; `deploy.yml` deploys to GitHub Pages and sets it from the repo name.
- Production builds drop `console` calls and emit gzip and brotli files.
