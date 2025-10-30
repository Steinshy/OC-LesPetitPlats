/* Main entry point. Imports global styles and initializes the application. */

import "../styles/global.css";
import { mobileMenuManager } from "./mobileMenu.js";
import { buildRecipes } from "./utils/dataBuilders.js";

buildRecipes();
mobileMenuManager();
// Search Results
// const results = await searchRecipes("chocolat");
console.info("Les Petits Plats application initialized");
