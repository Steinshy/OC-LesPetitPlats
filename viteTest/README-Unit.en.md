# Unit Tests

🇫🇷 [Français](README-Unit.md)

Unit and component tests to validate the functional behavior of the LesPetitPlats application and ensure code quality.

## 🎯 About

This system uses **Vitest** as a test framework to ensure code coverage and functional validation. Unit tests allow validating the behavior of application components and utilities.

## ✨ Features

- ✅ **Unit tests**: Validation of functional behavior of components and utilities
- 🎭 **Component tests**: scrollLock, cards, dropdown, filters, search, skeletons, scrollToTop
- 🔧 **Utility tests**: cache, imageTracker, toast, recipeApi, recipesBuilder, normalize
- 📊 **Code coverage**: Coverage reports with configurable thresholds
- 🔄 **Watch mode**: Real-time execution on changes
- 🎪 **Mocks and helpers**: Complete infrastructure for tests with mocks and utilities

## 💻 Usage

```bash
# Run all tests
npm test

# Watch mode (monitoring changes)
npm test -- --watch

# Specific file
npm test -- tests/normalize.test.js

# Generate coverage report
npm run test:coverage
# Report available in benchmark-results/Unit/index.html
```

**Coverage thresholds:** Lines 70%, Functions 70%, Branches 65%, Statements 70%

## Writing Tests

**Best practices:** Speed, Isolation, Repeatability, Self-verification, Clear naming

**Structure:**

```javascript
import { describe, it, expect } from "vitest";

describe("moduleName", () => {
  it("should do something specific", () => {
    const input = "test";
    const result = myFunction(input);
    expect(result).toBe("expected");
  });
});
```

## 🛠️ Technologies

- **[Vitest](https://vitest.dev/)** - Fast and modern test framework
- **[jsdom](https://github.com/jsdom/jsdom)** - Simulated DOM environment for component tests
- `@vitest/coverage-v8` - Code coverage

## 📁 Structure

```text
Unit/
├── data/               # Test data and shared constants
│   └── data.js
├── helpers/            # Test utilities
│   └── utils.js
├── mocks/              # Mocks and wrappers for tests
│   ├── components/     # Component mocks
│   │   ├── filters/manager.js
│   │   └── search/render.js
│   ├── utils/          # Utility mocks
│   │   ├── filterEngine.js
│   │   └── imageTracker.js
│   └── wrappers.js
├── tests/              # Unit tests organized by structure
│   ├── components/     # Component tests
│   │   ├── cards/render.test.js
│   │   ├── dropdowns/  # data.test.js, manager.test.js, render.test.js
│   │   ├── filters/tags.test.js
│   │   ├── search/     # manager.test.js, render.test.js, search.test.js
│   │   ├── skeletons/manager.test.js
│   │   ├── scrollLock.test.js
│   │   └── scrollToTop.test.js
│   └── utils/          # Utility tests
│       ├── cache.test.js
│       ├── filterEngine.test.js
│       ├── imageTracker.test.js
│       ├── normalize.test.js
│       ├── recipeApi.test.js
│       ├── recipesBuilder.test.js
│       └── toast.test.js
└── setup.js            # Global test configuration
```

## 🔗 Path Aliases

The following path aliases are available to simplify imports:

```javascript
@tests/*                   → viteTest/Unit/*
@tests-tests/*             → viteTest/Unit/tests/*
@tests-data/*              → viteTest/Unit/data/*
@tests-helpers/*           → viteTest/Unit/helpers/*
@tests-mocks/*             → viteTest/Unit/mocks/*
@viteTest-helper/*         → viteTest/helper/* (message, console, fileSystem, etc.)
```

## 📝 Contribution

To add a new test: create `*.test.js` in `Unit/tests/`, follow the recommended structure, run `npm test`

## 📄 License

This project is part of the LesPetitPlats project and follows the same license as the main project.
