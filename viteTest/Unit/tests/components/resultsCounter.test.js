import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { updateResultsCounter } from "@/components/resultsCounter.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

const RESULTS_COUNTER_ID = "counter";
const TEXT_AUCUN_RESULTAT = "Aucun résultat";
const TEXT_RESULTATS = "résultats";

describe("resultsCounter", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("updateResultsCounter", () => {
    it("should set counter text to 'Aucun résultat' when count is 0", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      updateResultsCounter(0);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(TEXT_AUCUN_RESULTAT);
    });

    it("should set counter text to singular 'résultat' when count is 1", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      updateResultsCounter(1);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe("1 résultat");
    });

    it("should set counter text to plural 'résultats' when count is greater than 1", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      updateResultsCounter(5);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(`5 ${TEXT_RESULTATS}`);
    });

    it("should handle large counts", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      updateResultsCounter(1000);

      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(`1000 ${TEXT_RESULTATS}`);
    });

    it("should not throw error when counter element does not exist", () => {
      document.body.innerHTML = "";

      expect(() => updateResultsCounter(5)).not.toThrow();
    });

    it("should update counter text when called multiple times", () => {
      document.body.innerHTML = `<div id="${RESULTS_COUNTER_ID}"></div>`;

      updateResultsCounter(5);
      const counter = document.getElementById(RESULTS_COUNTER_ID);
      expect(counter.textContent).toBe(`5 ${TEXT_RESULTATS}`);

      updateResultsCounter(10);
      expect(counter.textContent).toBe(`10 ${TEXT_RESULTATS}`);

      updateResultsCounter(0);
      expect(counter.textContent).toBe(TEXT_AUCUN_RESULTAT);
    });
  });

  afterAll(() => {
    logCategorySummary("resultsCounter", "Results Counter", "All results counter tests");
  });
});
