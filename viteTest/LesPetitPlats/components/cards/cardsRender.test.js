import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { setupRecipesCards } from "@/components/cards/manager.js";
import {
  renderNoResults,
  renderCardPicture,
  renderCardHeader,
  renderCardContents,
} from "@/components/cards/render.js";
import { logCategorySummary } from "../../utils/logging/console.js";

vi.mock("@/utils/deliveryImages.js", () => ({
  imagesTypes: vi.fn(),
}));

vi.mock("@/components/skeletonsManager.js", () => ({
  cardSkeletons: vi.fn(() => ({
    build: vi.fn(),
    hide: vi.fn(),
  })),
}));

const TEST_JPG_URL = "/recipes/test.jpg";
const TEST_WEBP_URL = "/recipes/test.webp";

describe("cards render", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section class="cards-container" id="recipes" aria-label="Liste des recettes"></section>
      <div class="no-results hidden" id="no-results"></div>
    `;
  });

  describe("renderNoResults", () => {
    it("should render empty state HTML", () => {
      const html = renderNoResults();

      expect(html).toContain("no-results-icon");
      expect(html).toContain("Aucune recette trouvée");
      expect(html).toContain("Essayez de modifier");
    });

    it("should include logo icon", () => {
      const html = renderNoResults();
      expect(html).toContain("logoIcon.svg");
      expect(html).toContain("Les Petits Plats");
    });
  });

  describe("renderCardPicture", () => {
    it("should render card picture with image data", () => {
      const imageData = {
        jpgUrl: TEST_JPG_URL,
        webpUrl: TEST_WEBP_URL,
        alt: "Test Recipe",
      };

      const html = renderCardPicture(imageData);

      expect(html).toContain("card-picture");
      expect(html).toContain(TEST_JPG_URL);
      expect(html).toContain(TEST_WEBP_URL);
      expect(html).toContain("Test Recipe");
    });

    it("should handle null image data", () => {
      const html = renderCardPicture(null);

      expect(html).toContain("card-picture");
    });

    it("should handle image data with only jpgUrl", () => {
      const imageData = {
        jpgUrl: TEST_JPG_URL,
        alt: "Test",
      };

      const html = renderCardPicture(imageData);
      expect(html).toContain("/recipes/test.jpg");
      expect(html).not.toContain("source");
    });

    it("should include WebP source when webpUrl is provided", () => {
      const imageData = {
        jpgUrl: TEST_JPG_URL,
        webpUrl: TEST_WEBP_URL,
        alt: "Test",
      };

      const html = renderCardPicture(imageData);
      expect(html).toContain("<source");
      expect(html).toContain('type="image/webp"');
    });
  });

  describe("renderCardHeader", () => {
    it("should render card header with name", () => {
      const html = renderCardHeader("Tarte aux pommes");

      expect(html).toContain("card-header");
      expect(html).toContain("Tarte aux pommes");
    });

    it("should handle empty name", () => {
      const html = renderCardHeader("");
      expect(html).toContain("card-header");
    });
  });

  describe("renderCardContents", () => {
    const mockIngredients = [
      { ingredient: "Pomme", quantity: 3 },
      { ingredient: "Sucre", quantity: 50, unit: "g" },
    ];

    it("should render card contents with description and ingredients", () => {
      const html = renderCardContents("Délicieuse tarte", mockIngredients);

      expect(html).toContain("contents-container");
      expect(html).toContain("Délicieuse tarte");
      expect(html).toContain("Pomme");
      expect(html).toContain("3");
      expect(html).toContain("Sucre");
      expect(html).toContain("50 g");
    });

    it("should include ingredient count in heading", () => {
      const html = renderCardContents("Description", mockIngredients);
      expect(html).toContain("INGRÉDIENTS (2)");
    });

    it("should handle empty ingredients array", () => {
      const html = renderCardContents("Description", []);

      expect(html).toContain("INGRÉDIENTS (0)");
      expect(html).toContain("ingredients-details");
    });

    it("should handle ingredients without unit", () => {
      const ingredients = [{ ingredient: "Tomato", quantity: 2 }];
      const html = renderCardContents("Description", ingredients);

      expect(html).toContain("Tomato");
      expect(html).toContain("2");
    });

    it("should handle ingredients with unit", () => {
      const ingredients = [{ ingredient: "Sugar", quantity: 100, unit: "g" }];
      const html = renderCardContents("Description", ingredients);

      expect(html).toContain("Sugar");
      expect(html).toContain("100 g");
    });
  });

  describe("setupRecipesCards", () => {
    it("renders a single card with correct structure", () => {
      const recipes = [
        {
          id: 1,
          name: "Tarte aux pommes",
          description: "Délicieuse tarte maison",
          servings: 4,
          time: 45,
          ingredients: [
            { ingredient: "Pomme", quantity: 3 },
            { ingredient: "Sucre", quantity: 50, unit: "g" },
          ],
          ustensils: ["couteau"],
          appliance: "four",
          images: { jpgUrl: TEST_JPG_URL, webpUrl: TEST_WEBP_URL, alt: "Tarte" },
        },
      ];

      setupRecipesCards(recipes);

      const container = document.getElementById("recipes");
      const card = container.querySelector(".card");
      expect(card).toBeTruthy();
      expect(card.id).toBe("1");
      expect(card.querySelector(".card-header h2").textContent).toBe("Tarte aux pommes");
      expect(card.querySelector(".card-time").textContent).toContain("45");
      expect(card.querySelectorAll(".ingredients-details .ingredient-items").length).toBe(2);

      // Empty state should be hidden when cards render
      const empty = document.getElementById("no-results");
      expect(empty.classList.contains("hidden")).toBe(true);
    });

    it("should show empty state when no recipes", () => {
      setupRecipesCards([]);

      const empty = document.getElementById("no-results");
      expect(empty.classList.contains("hidden")).toBe(false);
    });

    it("should render multiple cards", () => {
      const recipes = [
        { id: 1, name: "Recipe 1", description: "Desc 1", time: 30, ingredients: [] },
        { id: 2, name: "Recipe 2", description: "Desc 2", time: 45, ingredients: [] },
      ];

      setupRecipesCards(recipes);

      const container = document.getElementById("recipes");
      const cards = container.querySelectorAll(".card");
      expect(cards.length).toBe(2);
    });
  });

  afterAll(() => {
    logCategorySummary("cardsRender", "Cards Render", "All cards render tests");
  });
});
