import { describe, it, expect, beforeEach } from "vitest";
import { setupRecipesCards } from "../../src/components/cards/manager.js";

describe("cards manager render", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section class="cards-container" id="cards-container" aria-label="Liste des recettes"></section>
      <div class="no-results hidden" id="no-results"></div>
    `;
  });

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
        images: { jpgUrl: "/recipes/test.jpg", webpUrl: "/recipes/test.webp", alt: "Tarte" },
      },
    ];

    setupRecipesCards(recipes);

    const container = document.getElementById("cards-container");
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
});

