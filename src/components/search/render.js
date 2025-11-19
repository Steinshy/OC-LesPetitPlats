export const searchSection = (imageData = null) => {
  const imageUrl = imageData?.jpgUrl || imageData?.webpUrl || null;
  const backgroundImageUrl = imageUrl ? `background-image: url('${imageUrl}') !important;` : "";

  return `
    <section id="search-section" class="search-section"${backgroundImageUrl ? ` style="${backgroundImageUrl}"` : ""}>
      <div class="header-image-placeholder"></div>
      <div id="search-header" class="search-header">
        <h2>
          Cherchez parmi plus de 1500 recettes <br>
          du quotidien, simples et délicieuses
        </h2>
      </div>
      <div class="search-bar-group">
        <label for="recipe-search" class="sr-only">Rechercher une recette, un ingrédient</label>
        <input 
          type="text" 
          id="recipe-search"
          name="recipe-search"
          placeholder="Rechercher une recette, un ingrédient...">
        <button type="button" id="clear-recipe-search" class="search-clear-btn hidden" aria-label="Effacer la recherche">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <button type="button" aria-label="Lancer la recherche" class="search-btn">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        </button>
      </div>
    </section>
  `;
};
