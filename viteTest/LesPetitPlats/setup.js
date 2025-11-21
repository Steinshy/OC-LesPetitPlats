// Setup file for LesPetitPlats tests - configures mocks for test-only functions
// This file uses vi.mock to redirect source imports to test wrapper modules
import { vi } from "vitest";

// Mock deliveryImages to use wrapper with selectRandomImages
vi.mock("@/utils/deliveryImages.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/deliveryImages.js");
  return wrapper;
});

// Mock filtersBy to use wrapper with test aliases
vi.mock("@/components/filters/filtersBy.js", async () => {
  const wrapper = await vi.importActual("./utils/mocks/filtersBy.js");
  return wrapper;
});

// Mock filters manager to use wrapper with missing exports
vi.mock("@/components/filters/manager.js", async () => {
  const actual = await vi.importActual("@/components/filters/manager.js");
  const wrapper = await vi.importActual("./utils/mocks/filtersManager.js");
  return { ...actual, ...wrapper };
});
