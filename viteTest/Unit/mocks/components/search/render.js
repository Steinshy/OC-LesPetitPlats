// Test wrapper for search render (provides renderDropdownSearch not exported from dropdowns/render.js)
export const renderDropdownSearch = (type) => {
  const searchInputId = `search-${type}`;
  const labelId = `label-${type}`;
  return `
    <div class="dropdown-search" id="dropdown-${type}-search">
      <label for="${searchInputId}" id="${labelId}" class="sr-only">Rechercher un ${type}</label>
      <input 
        type="text" 
        id="${searchInputId}"
        name="${searchInputId}"
        aria-labelledby="${labelId}"
        placeholder="Rechercher un ${type}...">
      <button type="button" id="dropdown-${type}-search-clear-button" class="search-clear-btn hidden" aria-label="Effacer la recherche">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
      <button type="button" id="dropdown-${type}-search-submit-button" aria-label="Lancer la recherche" class="search-button">
        <i class="ri-search-line" aria-hidden="true"></i>
      </button>
    </div>
  `;
};

export const mainHeader = imageData => {
  const { webpUrl, jpgUrl } = imageData || {};
  const imageUrl = webpUrl || jpgUrl || "";
  const backgroundStyle = imageUrl
    ? `style="background-image: url(${imageUrl})"`
    : 'style="background-image: url()"';

  return `
    <section id="header-title" class="header-title" ${backgroundStyle}>
      <h1>
        Cherchez parmi plus de 1500 recettes <br>
        du quotidien, simples et délicieuses
      </h1>
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

        <button type="button" id="search-submit-button" aria-label="Lancer la recherche" class="search-button main-search-btn">
          <i class="ri-search-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;
};
