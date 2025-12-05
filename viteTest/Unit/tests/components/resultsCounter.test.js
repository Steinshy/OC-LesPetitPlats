import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { setupResultsCounter } from "@/components/resultsCounter.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

const RESULTS_COUNTER_ID = "results-counter";
const TEXT_AUCUN_RESULTATS = "Aucun résultats";
const TEXT_RESULTATS = "résultats";

describe("resultsCounter", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("setupResultsCounter", () => {
    it("should set counter text to 'Aucun résultats' when count is 0", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      setupResultsCounter(0);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(TEXT_AUCUN_RESULTATS);
    });

    it("should set counter text to singular 'résultat' when count is 1", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      setupResultsCounter(1);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe("1 résultat");
    });

    it("should set counter text to plural 'résultats' when count is greater than 1", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      setupResultsCounter(5);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(`5 ${TEXT_RESULTATS}`);
    });

    it("should handle large counts", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      setupResultsCounter(1000);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(`1000 ${TEXT_RESULTATS}`);
    });

    it("should not throw error when counter element does not exist", () => {
      document.body.innerHTML = "";

      expect(() => setupResultsCounter(5)).not.toThrow();
    });

    it("should update counter text when called multiple times", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      setupResultsCounter(5);
      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(`5 ${TEXT_RESULTATS}`);

      setupResultsCounter(10);
      expect(counter.textContent).toBe(`10 ${TEXT_RESULTATS}`);

      setupResultsCounter(0);
      expect(counter.textContent).toBe(TEXT_AUCUN_RESULTATS);
    });
  });

  afterAll(() => {
    logCategorySummary("resultsCounter", "Results Counter", "All results counter tests");
  });
});
