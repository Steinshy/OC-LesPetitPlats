// src/components/skeletonsRenderer.js
export const dropdownSkeleton = () => {
  return `
    <div class="dropdown-container skeleton">
      <button type="button" class="filter-dropdown" disabled
        aria-expanded="false" aria-label="Chargement">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    </div>
  `;
};

export const cardSkeleton = count => {
  if (!count || count <= 0) return "";
  const skeleton = `
    <div class="card skeleton">
      <div class="card-picture">
      </div>
    </div>
  `;
  return Array.from({ length: count }, () => skeleton).join("");
};
