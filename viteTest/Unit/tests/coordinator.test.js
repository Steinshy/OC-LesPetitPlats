import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { setupCoordinator, markInitialSyncComplete } from "@/coordinator.js";
import * as cardsModule from "@/components/cards/manager.js";
import * as dropdownsModule from "@/components/dropdowns/manager.js";
import * as resultsCounterModule from "@/components/resultsCounter.js";
import * as urlStateModule from "@/utils/urlState.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

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
    it("should set up event listener for filters:stateChanged", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");

      setupCoordinator();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "filters:stateChanged",
        expect.any(Function),
      );
    });

    it("should call setupRecipesCards when filters:stateChanged event is dispatched", () => {
      setupCoordinator();

      const filteredRecipes = [{ id: 1 }, { id: 2 }];
      const event = new CustomEvent("filters:stateChanged", {
        detail: {
          filteredRecipes,
          filters: {},
        },
      });

      document.dispatchEvent(event);

      expect(cardsModule.setupRecipesCards).toHaveBeenCalledWith(filteredRecipes);
    });

    it("should call setupDropdowns when filters:stateChanged event is dispatched", () => {
      setupCoordinator();

      const filteredRecipes = [{ id: 1 }, { id: 2 }];
      const event = new CustomEvent("filters:stateChanged", {
        detail: {
          filteredRecipes,
          filters: {},
        },
      });

      document.dispatchEvent(event);

      expect(dropdownsModule.setupDropdowns).toHaveBeenCalledWith(filteredRecipes);
    });

    it("should call setupResultsCounter with recipe count when filters:stateChanged event is dispatched", () => {
      setupCoordinator();

      const filteredRecipes = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const event = new CustomEvent("filters:stateChanged", {
        detail: {
          filteredRecipes,
          filters: {},
        },
      });

      document.dispatchEvent(event);

      expect(resultsCounterModule.setupResultsCounter).toHaveBeenCalledWith(3);
    });

    it("should not call updateURLState on initial sync", async () => {
      await vi.isolateModules(async () => {
        const { setupCoordinator: setupCoordinatorIsolated } = await import("@/coordinator.js");
        setupCoordinatorIsolated();

        const filteredRecipes = [{ id: 1 }];
        const filters = { ingredients: new Set(["tomato"]) };
        const event = new CustomEvent("filters:stateChanged", {
          detail: {
            filteredRecipes,
            filters,
          },
        });

        document.dispatchEvent(event);

        expect(urlStateModule.updateURLState).not.toHaveBeenCalled();
      });
    });

    it("should call updateURLState after initial sync", () => {
      setupCoordinator();

      const filteredRecipes1 = [{ id: 1 }];
      const event1 = new CustomEvent("filters:stateChanged", {
        detail: {
          filteredRecipes: filteredRecipes1,
          filters: {},
        },
      });
      document.dispatchEvent(event1);

      const filteredRecipes2 = [{ id: 2 }];
      const filters = { ingredients: new Set(["tomato"]) };
      const event2 = new CustomEvent("filters:stateChanged", {
        detail: {
          filteredRecipes: filteredRecipes2,
          filters,
        },
      });
      document.dispatchEvent(event2);

      expect(urlStateModule.updateURLState).toHaveBeenCalledWith(filters);
    });

    it("should handle empty filteredRecipes array", () => {
      setupCoordinator();

      const event = new CustomEvent("filters:stateChanged", {
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

  describe("markInitialSyncComplete", () => {
    it("should allow updateURLState to be called after markInitialSyncComplete", () => {
      setupCoordinator();
      markInitialSyncComplete();

      const filteredRecipes = [{ id: 1 }];
      const filters = { ingredients: new Set(["tomato"]) };
      const event = new CustomEvent("filters:stateChanged", {
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
