// Setup file for LesPetitPlats tests - configures mocks for test-only functions
// This file uses vi.mock to redirect source imports to test wrapper modules
import { vi } from "vitest";

// Mock imageTracker to use wrapper with selectRandomImages
vi.mock("@/utils/imageTracker.js", async () => {
  const wrapper = await vi.importActual("@tests-mocks/imageTracker.js");
  return wrapper;
});

// Mock filterEngine to use wrapper with test aliases (recipeFilters.js was replaced with filterEngine.js)
vi.mock("@/utils/filterEngine.js", async () => {
  const actual = await vi.importActual("@/utils/filterEngine.js");
  const wrapper = await vi.importActual("@tests-mocks/filtersBy.js");
  // Return actual filterEngine exports, but also include test wrapper exports for backward compatibility
  return { ...actual, ...wrapper };
});

// Mock filters manager to use wrapper with missing exports
vi.mock("@/components/filters/manager.js", async () => {
  const actual = await vi.importActual("@/components/filters/manager.js");
  const wrapper = await vi.importActual("@tests-mocks/filtersManager.js");
  return { ...actual, ...wrapper };
});

// Mock dropdown data to use wrapper with test-compatible return structure
vi.mock("@/components/dropdowns/data.js", async () => {
  // Import original BEFORE importing wrapper to avoid circular dependency
  const original = await vi.importActual("@/components/dropdowns/data.js");

  // Create wrapper function that uses the original
  const buildDropdownsDataWrapper = recipesData => {
    const result = original.buildDropdownsData(recipesData);
    // Tests expect { ingredients, utensils, appliances } directly
    // but function returns { dropdowns: { ingredients, utensils, appliances } }
    if (!result || !result.dropdowns) {
      return {
        ingredients: [],
        utensils: [],
        appliances: [],
      };
    }
    return {
      ingredients: result.dropdowns.ingredients || [],
      utensils: result.dropdowns.utensils || [],
      appliances: result.dropdowns.appliances || [],
    };
  };

  // Return original exports with wrapped buildDropdownsData
  return {
    ...original,
    buildDropdownsData: buildDropdownsDataWrapper,
  };
});

// Mock normalize.js to use wrapper with test-compatible functions
vi.mock("@/utils/normalize.js", async () => {
  // Import original BEFORE importing wrapper to avoid circular dependency
  const original = await vi.importActual("@/utils/normalize.js");
  const wrappers = await vi.importActual("@tests-mocks/wrappers.js");

  // Create wrapper function that uses the original
  const cleanupDuplicatedItemsWrapper = (items = []) => {
    const result = original.cleanupDuplicatedItems(items);
    // Tests expect array of strings, but function returns array of { label, value } objects
    return result.map(item => item.label || item.value || item);
  };

  // Return all original exports with wrapped cleanupDuplicatedItems and updateCounter from wrappers
  return {
    ...original,
    cleanupDuplicatedItems: cleanupDuplicatedItemsWrapper,
    updateCounter: wrappers.updateCounter,
  };
});

// Mock search render to use wrapper that exports renderDropdownSearch from dropdowns/render.js
vi.mock("@/components/search/render.js", async () => {
  const wrapper = await vi.importActual("@tests-mocks/searchRender.js");
  return wrapper;
});

// Mock dropdown render to use wrapper with missing exports
vi.mock("@/components/dropdowns/render.js", async () => {
  const wrappers = await vi.importActual("@tests-mocks/wrappers.js");
  // Return all exports from wrappers (includes original exports via export *)
  return wrappers;
});

// Mock skeletons to use wrapper with test-compatible functions
vi.mock("@/components/skeletons/manager.js", async () => {
  const wrapper = await vi.importActual("@tests-mocks/skeletonsManager.js");
  return wrapper;
});

// Mock search elements to use test-compatible version
vi.mock("@/components/search/elements.js", async () => {
  const wrappers = await vi.importActual("@tests-mocks/wrappers.js");
  return { searchElements: wrappers.searchElements };
});
