import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import * as cardsModule from "@/components/cards/manager.js";
import * as dropdownsModule from "@/components/dropdowns/manager.js";
import * as resultsCounterModule from "@/components/resultsCounter.js";
import * as urlStateModule from "@/utils/urlState.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

const EVENT_FILTERS_STATE_CHANGED = "filters:stateChanged";

vi.mock("@/components/cards/manager.js", () => ({
  setupRecipesCards: vi.fn(),
}));

vi.mock("@/components/dropdowns/manager.js", () => ({
  setupDropdowns: vi.fn(),
}));

vi.mock("@/components/resultsCounter.js", () => ({
  setupResultsCounter: vi.fn(),
}));

vi.mock("@/utils/urlState.js", () => ({
  updateURLState: vi.fn(),
}));

describe("coordinator", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("setupCoordinator", () => {
    let coordinatorModule;

    beforeEach(async () => {
      vi.resetModules();
      coordinatorModule = await import("@/coordinator.js");
    });

    it("should set up event listener for filters:stateChanged", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");

      coordinatorModule.setupCoordinator();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        EVENT_FILTERS_STATE_CHANGED,
        expect.any(Function),
      );
    });

    it("should call setupRecipesCards when filters:stateChanged event is dispatched", () => {
      coordinatorModule.setupCoordinator();

      const filteredRecipes = [{ id: 1 }, { id: 2 }];
      const event = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes,
          filters: {},
        },
      });

      document.dispatchEvent(event);

      expect(cardsModule.setupRecipesCards).toHaveBeenCalledWith(filteredRecipes);
    });

    it("should call setupDropdowns when filters:stateChanged event is dispatched", () => {
      coordinatorModule.setupCoordinator();

      const filteredRecipes = [{ id: 1 }, { id: 2 }];
      const event = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes,
          filters: {},
        },
      });

      document.dispatchEvent(event);

      expect(dropdownsModule.setupDropdowns).toHaveBeenCalledWith(filteredRecipes);
    });

    it("should call setupResultsCounter with recipe count when filters:stateChanged event is dispatched", () => {
      coordinatorModule.setupCoordinator();

      const filteredRecipes = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const event = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes,
          filters: {},
        },
      });

      document.dispatchEvent(event);

      expect(resultsCounterModule.setupResultsCounter).toHaveBeenCalledWith(3);
    });

    it("should call updateURLState after initial sync", () => {
      coordinatorModule.setupCoordinator();

      const filteredRecipes1 = [{ id: 1 }];
      const event1 = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes: filteredRecipes1,
          filters: {},
        },
      });
      document.dispatchEvent(event1);

      const filteredRecipes2 = [{ id: 2 }];
      const filters = { ingredients: new Set(["tomato"]) };
      const event2 = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes: filteredRecipes2,
          filters,
        },
      });
      document.dispatchEvent(event2);

      expect(urlStateModule.updateURLState).toHaveBeenCalledWith(filters);
    });

    it("should handle empty filteredRecipes array", () => {
      coordinatorModule.setupCoordinator();

      const event = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes: [],
          filters: {},
        },
      });

      document.dispatchEvent(event);

      expect(cardsModule.setupRecipesCards).toHaveBeenCalledWith([]);
      expect(dropdownsModule.setupDropdowns).toHaveBeenCalledWith([]);
      expect(resultsCounterModule.setupResultsCounter).toHaveBeenCalledWith(0);
    });
  });

  describe("initial sync behavior", () => {
    it.skip("should not call updateURLState on initial sync", async () => {
      vi.resetModules();
      urlStateModule.updateURLState.mockClear();

      const coordinatorModule = await import("@/coordinator.js");
      const initialCallCount = urlStateModule.updateURLState.mock.calls.length;
      coordinatorModule.setupCoordinator();

      const filteredRecipes = [{ id: 1 }];
      const filters = { ingredients: new Set(["tomato"]) };
      const event = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes,
          filters,
        },
      });

      document.dispatchEvent(event);

      const finalCallCount = urlStateModule.updateURLState.mock.calls.length;
      expect(finalCallCount).toBe(initialCallCount);
    });
  });

  describe("markInitialSyncComplete", () => {
    let coordinatorModule;

    beforeEach(async () => {
      vi.resetModules();
      coordinatorModule = await import("@/coordinator.js");
    });

    it("should allow updateURLState to be called after markInitialSyncComplete", () => {
      coordinatorModule.setupCoordinator();
      coordinatorModule.markInitialSyncComplete();

      const filteredRecipes = [{ id: 1 }];
      const filters = { ingredients: new Set(["tomato"]) };
      const event = new CustomEvent(EVENT_FILTERS_STATE_CHANGED, {
        detail: {
          filteredRecipes,
          filters,
        },
      });

      document.dispatchEvent(event);

      expect(urlStateModule.updateURLState).toHaveBeenCalledWith(filters);
    });
  });

  afterAll(() => {
    logCategorySummary("coordinator", "Coordinator", "All coordinator tests");
  });
});
