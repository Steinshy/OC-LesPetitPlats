import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { emptyCards, renderCard, renderIngredient } from "@/components/cards/render.js";
import { cardsUi } from "@/components/cards/ui.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

vi.mock("@/utils/imageTracker.js", () => ({
  setupImageTracking: vi.fn(),
}));

vi.mock("@/components/skeletons/manager.js", () => ({
  cardsSkeletons: vi.fn(() => ({
    show: vi.fn(),
    hide: vi.fn(),
  })),
}));

vi.mock("@/components/cards/elements.js", () => ({
  cardsElements: () => ({
    container: document.getElementById("cards-container"),
  }),
}));

vi.mock("@/components/cards/manager.js", async () => {
  const actual = await vi.importActual("@/components/cards/manager.js");
  return actual;
});

const TEST_JPG_URL = "/recipes/test.jpg";
const TEST_WEBP_URL = "/recipes/test.webp";

describe("cards render", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="cards" class="cards" aria-label="Liste des recettes">
        <div class="cards-container" id="cards-container"></div>
      </section>
    `;
  });

  describe("emptyCards", () => {
    it("should render empty state HTML", () => {
      const html = emptyCards();

      expect(html).toContain("empty-cards");
      expect(html).toContain("empty-cards-icon");
      expect(html).toContain("Aucune recette trouvée");
      expect(html).toContain("Essayez de modifier");
    });

    it("should include error icon", () => {
      const html = emptyCards();
      expect(html).toContain("ri-error-warning-line");
      expect(html).toContain("empty-cards-icon");
    });
  });

  describe("renderCard", () => {
    it("should render complete card with all elements", () => {
      const html = renderCard(
        1,
        "Tarte aux pommes",
        45,
        "Délicieuse tarte maison",
        TEST_WEBP_URL,
        TEST_JPG_URL,
        "Tarte",
        2,
        '<div class="ingredient-chip"><span class="ingredient-name">Pomme</span><span class="ingredient-quantity">3</span></div>',
      );

      expect(html).toContain('id="card-1"');
      expect(html).toContain("Tarte aux pommes");
      expect(html).toContain("45 min");
      expect(html).toContain("Délicieuse tarte maison");
      expect(html).toContain(TEST_JPG_URL);
      expect(html).toContain(TEST_WEBP_URL);
      expect(html).toContain("Tarte");
      expect(html).toContain("card-header");
      expect(html).toContain("card-recipe");
      expect(html).toContain("card-ingredients");
      expect(html).toContain("tag-time");
      expect(html).toContain("description-button");
      expect(html).toContain("card-see-more");
      expect(html).toContain("card-recipe-container");
    });

    it("should include picture element with source", () => {
      const html = renderCard(1, "Test", 30, "Desc", TEST_WEBP_URL, TEST_JPG_URL, "Alt", 0, "");

      expect(html).toContain("<picture>");
      expect(html).toContain("<source");
      expect(html).toContain('type="image/webp"');
      expect(html).toContain(`srcset="${TEST_WEBP_URL}"`);
      expect(html).toContain(`src="${TEST_JPG_URL}"`);
    });

    it("should include time tag with correct id", () => {
      const html = renderCard(5, "Test", 60, "Desc", "", "", "", 0, "");

      expect(html).toContain('id="tag-time-5"');
      expect(html).toContain('id="time-text-5"');
      expect(html).toContain("60 min");
    });

    it("should include description toggle button", () => {
      const html = renderCard(1, "Test", 30, "Desc", "", "", "", 0, "");

      expect(html).toContain("description-button");
      expect(html).toContain("card-see-more");
      expect(html).toContain("Voir plus");
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('id="description-button-1"');
      expect(html).toContain('id="card-see-more-1"');
    });

    it("should include ingredients count", () => {
      const html = renderCard(1, "Test", 30, "Desc", "", "", "", 5, "");

      expect(html).toContain("ingredient-count");
      expect(html).toContain("5");
      expect(html).toContain("Ingrédients");
    });
  });

  describe("renderIngredient", () => {
    it("should render ingredient chip with name and quantity", () => {
      const html = renderIngredient("Pomme", "3");

      expect(html).toContain("ingredient-chip");
      expect(html).toContain("ingredient-name");
      expect(html).toContain("ingredient-quantity");
      expect(html).toContain("Pomme");
      expect(html).toContain("3");
    });

    it("should handle quantity text with unit", () => {
      const html = renderIngredient("Sucre", "50 g");

      expect(html).toContain("Sucre");
      expect(html).toContain("50 g");
    });

    it("should handle au goût quantity", () => {
      const html = renderIngredient("Sel", "au goût");

      expect(html).toContain("Sel");
      expect(html).toContain("au goût");
    });
  });

  describe("cardsUi.render", () => {
    it("renders a single card with correct structure", () => {
      const recipes = [
        {
          id: 1,
          name: "Tarte aux pommes",
          description: "Délicieuse tarte maison",
          time: 45,
          ingredients: [
            { ingredient: "Pomme", quantity: 3 },
            { ingredient: "Sucre", quantity: 50, unit: "g" },
          ],
          images: { jpgUrl: TEST_JPG_URL, webpUrl: TEST_WEBP_URL, alt: "Tarte" },
        },
      ];

      cardsUi.render(recipes);

      const container = document.getElementById("cards-container");
      const card = container.querySelector(".card");
      expect(card).toBeTruthy();
      expect(card.id).toBe("card-1");
      expect(card.querySelector(".card-header h2").textContent).toBe("Tarte aux pommes");
      expect(card.querySelector(".tag-time .time-text").textContent).toContain("45");
      expect(card.querySelectorAll(".ingredients-lists .ingredient-chip").length).toBe(2);
      expect(card.querySelector(".description-button")).toBeTruthy();
      expect(card.querySelector(".card-see-more")).toBeTruthy();
      expect(card.querySelector(".card-recipe-container")).toBeTruthy();
    });

    it("should show empty state when no recipes", () => {
      cardsUi.render([]);

      const container = document.getElementById("cards-container");
      const emptyCardsElement = container.querySelector(".empty-cards");
      expect(emptyCardsElement).toBeTruthy();
      expect(emptyCardsElement.id).toBe("empty-cards");
    });

    it("should render multiple cards", () => {
      const recipes = [
        {
          id: 1,
          name: "Recipe 1",
          description: "Desc 1",
          time: 30,
          ingredients: [],
          images: { jpgUrl: TEST_JPG_URL, webpUrl: TEST_WEBP_URL, alt: "Recipe 1" },
        },
        {
          id: 2,
          name: "Recipe 2",
          description: "Desc 2",
          time: 45,
          ingredients: [],
          images: { jpgUrl: TEST_JPG_URL, webpUrl: TEST_WEBP_URL, alt: "Recipe 2" },
        },
      ];

      cardsUi.render(recipes);

      const container = document.getElementById("cards-container");
      const cards = container.querySelectorAll(".card");
      expect(cards.length).toBe(2);
    });

    it("should handle null recipes data", () => {
      expect(() => cardsUi.render(null)).not.toThrow();
    });

    it("should handle missing container element", () => {
      document.body.innerHTML = "";
      expect(() => cardsUi.render([])).not.toThrow();
    });
  });

  afterAll(() => {
    logCategorySummary("cardsRender", "Cards Render", "All cards render tests");
  });
});
