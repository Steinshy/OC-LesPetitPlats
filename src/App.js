import { setupFilters } from "./components/filters/manager.js";
import { initScrollToTop } from "./components/scrollToTop.js";
import { setupSearchSection } from "./components/search/manager.js";
import { buildRecipesData } from "./utils/recipesBuilder.js";
import { updateCounter } from "./utils/string.js";
import "../styles/global.css";

const initApp = async () => {
  try {
    const recipesData = await buildRecipesData();
    updateCounter(recipesData.length);
    setupSearchSection(recipesData);
    setupFilters(recipesData);
  } catch (error) {
    console.error("Error loading recipes:", error);
  }
  initScrollToTop();
};

initApp();
