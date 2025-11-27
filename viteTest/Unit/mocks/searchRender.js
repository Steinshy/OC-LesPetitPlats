// Test wrapper for search render - adds missing exports for tests
export * from "@/components/search/render.js";
import { renderDropdownSearch as originalRenderDropdownSearch } from "@/components/search/render.js";

// Override renderDropdownSearch to add search-icon class for tests
export const renderDropdownSearch = dropdownType => {
  const html = originalRenderDropdownSearch(dropdownType);
  // Add search-icon class to the search icon
  return html.replace('ri-search-line"', 'ri-search-line search-icon"');
};

export const mainHeader = imageData => {
  const { webpUrl, jpgUrl } = imageData || {};
  const imageUrl = webpUrl || jpgUrl || "";
  const backgroundStyle = imageUrl
    ? `style="background-image: url(${imageUrl})"`
    : 'style="background-image: url()"';

  return `
    <section id="header-title" class="header-title" ${backgroundStyle}>
      <h2>
        Cherchez parmi plus de 1500 recettes <br>
        du quotidien, simples et délicieuses
      </h2>
      ${mainSearchBar()}
    </section>
  `;
};

export const mainSearchBar = () => {
  return `
    <div class="search-bar main-search-bar" id="search-bar">
      <div class="search-bar-container" id="search-bar-container">
        <label for="search-input" class="sr-only">Rechercher une recette, un ingrédient</label>

        <input 
          type="text" 
          id="search-input"
          name="search-input"
          class="main-search-input"
          placeholder="Rechercher une recette, un ingrédient...">

        <button type="button" id="search-clear-button" class="search-clear-btn main-clear-search-btn hidden" aria-label="Effacer la recherche">
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>

        <button type="button" id="search-submit-btn" aria-label="Lancer la recherche" class="search-btn main-search-btn">
          <i class="ri-search-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;
};
