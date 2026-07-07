# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

"Les Petits Plats" — a recipe search engine (OpenClassrooms project). Vanilla JavaScript (ES modules, no framework), built with Vite, styled with Tailwind CSS v4. Static site deployed to GitHub Pages under the base path `/OC-LesPetitPlats/`. UI text is in French.

## Commands

The project uses **pnpm** (not npm).

- `pnpm install` — install dependencies
- `pnpm dev` — dev server on port 5173 (strict)
- `pnpm build` — production build to `dist/`
- `pnpm preview` — preview the production build
- `pnpm lint` — ESLint + Stylelint + html-validate
- `pnpm lint:fix` — auto-fix ESLint issues
- `pnpm format` — Prettier over `src/`

There are no automated tests.

## Architecture

Entry point: `index.html` loads `src/App.js`, which fetches recipes from `public/api/data.json` (via `recipeApi` + a TTL/LRU cache), transforms them (`recipesBuilder`), then wires up each feature with a `setup*()` function that returns a cleanup callback (used by Vite HMR dispose).

### Path aliases (tsconfig.json, resolved by vite-tsconfig-paths)

- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@styles/*` → `styles/*`

### Module pattern

Each feature lives in `src/components/<feature>/` and follows the same file roles:

- `elements.js` — DOM lookups (functions returning objects of elements by id)
- `render.js` — HTML template strings
- `setup.js` — initialization; attaches listeners, returns a cleanup function
- `manager.js` / `ui.js` — DOM updates
- `interactions.js` — event handlers
- Features: `cards/`, `dropdowns/`, `filters/`, `search/`, `skeletons/`, plus single-file `hero.js`, `scroll.js`, `resultsCounter.js`

### Data flow

1. User input (search bar, dropdown item, tag removal) mutates `filtersState` (`filters/state.js`: a search string + three `Set`s: ingredients, appliances, utensils) via `updateFilterState`.
2. `filtersPipeline.apply()` (`filters/pipeline.js`) runs `filtersEngine.applyAll()` (`filters/engine.js`) over the recipes, syncs the URL query string (`utils/urlState.js`, supports back/forward via popstate), and emits `filters:updated` on the `eventBus`.
3. Subscribers react: cards re-render, dropdown contents rebuild, tag list and counters update.

Modules communicate only through `utils/eventBus.js` (`filters:updated`, `filters:searchChanged`, `dropdown:itemToggled`, `dropdown:opened`, `dropdown:closed`) — avoid direct cross-feature imports of behavior.

All string matching goes through `utils/normalize.js` (`normalizeString`: strips parentheses, accents, lowercases) so filters are accent/case-insensitive.

### Conventions

- Setup functions must return a cleanup function that removes every listener they added (eventBus handlers must be **named** so `eventBus.off` can remove them — never pass a fresh arrow function to `off`).
- DOM access goes through the feature's `elements.js`; templates are string literals in `render.js`.
- Recipe data is trusted local JSON; template strings are injected with `innerHTML` without escaping — do not reuse these templates for untrusted input.

## Build specifics (vite.config.js)

- `base` is `/` in dev and `BASE_PATH` (`/OC-LesPetitPlats/`, overridable via env) in production — asset URLs must be built from `import.meta.env.BASE_URL` (see `utils/config.js` `baseUrl`).
- Production build drops `console.*`, pre-compresses assets (gzip + brotli), downloads webfonts locally, strips legacy font formats and remixicon SVGs, and chunks vendors manually.

## CI/CD (.github/workflows)

- `ci.yml` — lint + audit + CodeQL + build
- `deploy.yml` — build and deploy to GitHub Pages on push to `main`
