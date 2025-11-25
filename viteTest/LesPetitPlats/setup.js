// Setup file for LesPetitPlats tests - configures mocks for test-only functions
// This file uses vi.mock to redirect source imports to test wrapper modules
import { vi } from "vitest";

// Mock deliveryImages to use wrapper with selectRandomImages
vi.mock("@/utils/deliveryImages.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/deliveryImages.js");
  return wrapper;
});

// Mock recipeFilters to use wrapper with test aliases (old file was filtersBy.js, now recipeFilters.js)
vi.mock("@/components/filters/recipeFilters.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/filtersBy.js");
  return wrapper;
});

// Mock filters manager to use wrapper with missing exports
vi.mock("@/components/filters/manager.js", async () => {
  const actual = await vi.importActual("@/components/filters/manager.js");
  const wrapper = await vi.importActual("./utils/mocks/filtersManager.js");
  return { ...actual, ...wrapper };
});

// Mock dropdown data to use wrapper with test-compatible return structure
vi.mock("@/components/dropdown/data.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/dropdownData.js");
  return wrapper;
});

// Mock string utils to use wrapper with test-compatible functions
vi.mock("@/utils/string.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/string.js");
  return wrapper;
});

// Mock search render to use wrapper with missing exports
vi.mock("@/components/search/render.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/searchRender.js");
  return wrapper;
});

// Mock dropdown render to use wrapper with missing exports
vi.mock("@/components/dropdown/render.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/dropdownRender.js");
  return wrapper;
});

// Mock skeletons to use wrapper with test-compatible functions
vi.mock("@/components/skeletons.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/skeletonsManager.js");
  return wrapper;
});
