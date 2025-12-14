// Test setup configures mocks that mirror src/ structure
import { vi } from "vitest";

// Mock normalize.js with test-compatible wrapper
vi.mock("@/utils/normalize.js", async () => {
  const original = await vi.importActual("@/utils/normalize.js");
  const wrappers = await vi.importActual("@tests-mocks/wrappers.js");

  const cleanupDuplicatedItemsWrapper = (items = []) => {
    const result = original.cleanupDuplicatedItems(items);
    return result.map(item => item.label || item.value || item);
  };
  return {
    ...original,
    cleanupDuplicatedItems: cleanupDuplicatedItemsWrapper,
    updateCounter: wrappers.updateCounter,
  };
});

// Components mocks
vi.mock("@/components/filters/setup.js", async () => {
  const actual = await vi.importActual("@/components/filters/setup.js");
  const wrapper = await vi.importActual("@tests-mocks-components/filters/manager.js");
  return { ...actual, ...wrapper };
});

// Mock dropdown data - use actual implementation to match production code structure
vi.mock("@/components/dropdowns/data.js", async () => {
  const original = await vi.importActual("@/components/dropdowns/data.js");
  return original;
});

// Mock dropdown render with wrapper exports
vi.mock("@/components/dropdowns/render.js", async () => {
  const wrappers = await vi.importActual("@tests-mocks/wrappers.js");
  return wrappers;
});

// Mock search render with wrapper
vi.mock("@/components/search/render.js", async () => {
  const wrapper = await vi.importActual("@tests-mocks-components/search/render.js");
  return wrapper;
});

// Mock search elements with test-compatible version
vi.mock("@/components/search/elements.js", async () => {
  const wrappers = await vi.importActual("@tests-mocks/wrappers.js");
  return { searchElements: wrappers.searchElements };
});
