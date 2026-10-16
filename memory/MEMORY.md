---
name: LesPetitPlats Project Memory
description: Vanilla JS SPA with Vite and Tailwind CSS
type: Static Site
project: LesPetitPlats
category: Single Page Application
phase: Active Development
updated: 2026-03-23
tags:
  - Vanilla JavaScript
  - Vite
  - Tailwind CSS
  - EventBus
  - State Management
  - Caching
  - Recipe Search
  - Responsive Design
---

# LesPetitPlats Memory Index

**Last Consolidated:** March 23, 2026

## Quick Reference

| Section | Purpose |
|---------|---------|
| [Architecture](architecture.md) | EventBus pattern, module organization, state flow |
| [Component Patterns](component_patterns.md) | Reusable components, template system, rendering |
| [State Management](state_patterns.md) | EventBus implementation, subscription model |
| [Search & Filter](search_filter.md) | Algorithm complexity, caching, performance |
| [URL State Sync](url_state.md) | URL query parameters, browser back/forward support |
| [CSS Architecture](css_architecture.md) | Tailwind configuration, custom utilities, theming |
| [Performance](performance.md) | Caching strategy, bundle optimization, LCP/CLS metrics |

## Project Overview

**LesPetitPlats** is a recipe search and filtering application with advanced search capabilities and responsive design.

- **Tech Stack:** Vanilla JavaScript + Vite + Tailwind CSS
- **State Management:** Custom EventBus pattern (publish/subscribe)
- **Caching:** LRU cache for filter results and API responses
- **Search:** Multi-criteria filtering with optimized algorithm
- **URL State:** Synchronize filter state to URL for shareable links
- **Build:** Vite for fast development and optimized production builds
- **Styling:** Tailwind CSS with custom configuration

## Phase & Status

- **Phase:** Active Development
- **Memory Status:** ✅ Index created, detailed patterns pending
- **Next Review:** April 20, 2026

## Key Learnings by Category

### Architecture Pattern
- **EventBus:** Centralized event emitter for state changes
- **Flow:** User interaction → dispatch event → update model → emit update → view re-renders
- **Modules:** Separate concerns into managers (SearchManager, FilterManager, DataManager, UIManager)
- **Decoupling:** Modules communicate via events, not direct function calls
- **Example:** User selects filter → SearchManager emits filter:change → DataManager listens, updates cache → emits data:updated → UIManager listens, re-renders

### State Management
- **Immutable Updates:** Create new state objects, never mutate directly
- **Change Detection:** EventBus listeners re-run only on relevant events
- **No Global Variables:** All state flows through EventBus
- **Time Travel (Debug):** Can replay event sequence to reproduce issues

### Search & Filter Algorithm
- **Strategy:** Multi-criteria filtering with early termination
- **Complexity:** O(n * m) where n = recipes, m = filter criteria
- **Optimization:** Sort filter criteria by selectivity (most restrictive first)
- **Caching:** LRU cache stores recent filter results (max 50 entries)
- **Invalidation:** Clear cache on data updates only, not every render

### URL State Synchronization
- **Pattern:** Serialize filter state to URL query params
- **Params:** ?search=pasta&tag=vegetarian&sort=prep-time
- **Parsing:** Read params on page load, initialize filter state
- **Updates:** Debounce URL changes (300ms) to avoid excessive history entries
- **Browser Support:** Back button returns to previous filter state

### Tailwind CSS Architecture
- **Configuration:** Custom colors, spacing units, animations in tailwind.config.js
- **Utilities:** Pre-defined classes for common patterns
- **Responsive:** Breakpoints for mobile (default), tablet (md:), desktop (lg:)
- **Custom:** CSS variables for dynamic theming, @apply for complex components
- **Optimization:** Purge unused styles in production

### Component Rendering
- **Template System:** HTML template strings with interpolation
- **Re-render:** Diff old vs new HTML, update only changed elements
- **Performance:** Avoid full re-render, use .innerHTML only for changed sections
- **Events:** Attach listeners after rendering, use event delegation

### Performance Optimization
- **Metrics:**
  - LCP (Largest Contentful Paint): Target <2.5s
  - FID (First Input Delay): Target <100ms
  - CLS (Cumulative Layout Shift): Target <0.1
- **Code Splitting:** Lazy load manager modules if search is deferred
- **Caching:** Service worker caches recipes and images
- **Bundle:** Target <50KB gzipped

## Related Files

- **Source code:** `/src/` (managers, components, styles)
- **CSS:** `/src/styles/` (Tailwind config, custom styles)
- **Utils:** `/src/utils/` (EventBus, cache, search algorithm)
- **Tests:** `/tests/` (manager tests, integration tests)
- **Project config:** CLAUDE.md (overview), package.json (dependencies)

## Monthly Review Checklist

- [ ] Profile search performance with large datasets
- [ ] Verify LRU cache hit rates
- [ ] Check URL state sync for edge cases
- [ ] Audit bundle size and compression
- [ ] Monitor Core Web Vitals metrics

---

**Next Step:** Create detailed architecture.md and state_patterns.md files documenting EventBus implementation.
