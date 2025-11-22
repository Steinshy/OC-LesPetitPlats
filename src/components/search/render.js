export const mainHeader = imageData => {
  return `
    <section id="main-header" class="main-header" style="background-image: url(${imageData?.webpUrl || imageData?.jpgUrl || ""})">
      <div id="header-title" class="header-title">
        <h2>
          Cherchez parmi plus de 1500 recettes <br>
          du quotidien, simples et délicieuses
        </h2>
      </div>
      ${mainSearchBar()}
    </section>
  `;
};

export const mainSearchBar = () => {
  return `
    <div class="main-search-bar" id="main-search-bar">
      <div class="search-bar-container" id="search-bar-container">
        <label for="main-search-input" class="sr-only">Rechercher une recette, un ingrédient</label>

        <input 
          type="text" 
          id="main-search-input"
          name="main-search-input"
          placeholder="Rechercher une recette, un ingrédient...">

        <button type="button" id="main-clear-search-btn" class="search-clear-btn hidden" aria-label="Effacer la recherche">
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>

        <button type="button" id="main-search-btn" aria-label="Lancer la recherche" class="search-btn">
          <i class="ri-search-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;
};

export const renderDropdownSearch = dropdownType => {
  return `
    <div class="dropdown-search" id="dropdown-${dropdownType}-search">
    <input type="text" id="search-${dropdownType}" class="dropdown-search-input" aria-hidden="true"
      placeholder="Rechercher un ${dropdownType}...">
    <i class="ri-search-line dropdown-search-icon" id="search-icon-${dropdownType}" aria-hidden="true"></i>
    <button type="button" class="dropdown-search-clear hidden" id="clear-search-${dropdownType}" aria-label="Effacer la recherche" aria-hidden="true">
      <i class="ri-close-line"></i>
    </button>
  </div>
    `;
};
