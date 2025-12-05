import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { setupResultsCounter } from "@/components/resultsCounter.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

describe("resultsCounter", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("setupResultsCounter", () => {
    it("should set counter text to 'Aucun résultats' when count is 0", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';

      setupResultsCounter(0);

      const counter = document.getElementById("results-counter");
      expect(counter.textContent).toBe("Aucun résultats");
    });

    it("should set counter text to singular 'résultat' when count is 1", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';

      setupResultsCounter(1);

      const counter = document.getElementById("results-counter");
      expect(counter.textContent).toBe("1 résultat");
    });

    it("should set counter text to plural 'résultats' when count is greater than 1", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';

      setupResultsCounter(5);

      const counter = document.getElementById("results-counter");
      expect(counter.textContent).toBe("5 résultats");
    });

    it("should handle large counts", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';

      setupResultsCounter(1000);

      const counter = document.getElementById("results-counter");
      expect(counter.textContent).toBe("1000 résultats");
    });

    it("should not throw error when counter element does not exist", () => {
      document.body.innerHTML = "";

      expect(() => setupResultsCounter(5)).not.toThrow();
    });

    it("should update counter text when called multiple times", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';

      setupResultsCounter(5);
      const counter = document.getElementById("results-counter");
      expect(counter.textContent).toBe("5 résultats");

      setupResultsCounter(10);
      expect(counter.textContent).toBe("10 résultats");

      setupResultsCounter(0);
      expect(counter.textContent).toBe("Aucun résultats");
    });
  });

  afterAll(() => {
    logCategorySummary("resultsCounter", "Results Counter", "All results counter tests");
  });
});
