export const showSearchSkeleton = () => {
  document.querySelector(".main-search-bar")?.classList.add("skeleton-loading");
};

export const hideSearchSkeleton = () => {
  document.querySelector(".main-search-bar")?.classList.remove("skeleton-loading");
};

export const showDropdownsSkeletons = () => {
  const skeletonElements = [
    document.getElementById("dropdown-ingredients-container"),
    document.getElementById("dropdown-ustensils-container"),
    document.getElementById("dropdown-appliances-container"),
  ];

  skeletonElements.forEach(element => {
    if (element) {
      element.classList.add("skeleton-loading");
    }
  });
};

export const hideDropdownsSkeletons = () => {
  const skeletonElements = [
    document.getElementById("dropdown-ingredients-container"),
    document.getElementById("dropdown-ustensils-container"),
    document.getElementById("dropdown-appliances-container"),
  ];

  skeletonElements.forEach(element => {
    if (element) {
      element.classList.remove("skeleton-loading");
    }
  });
};

export const buildCardSkeletons = (length, container) => {
  if (!length || !container) return;

  container.innerHTML = "";
  for (let i = 0; i < length; i++) {
    const skeleton = document.createElement("div");
    skeleton.innerHTML = `
      <div class="card skeleton">
        <div class="card-picture">
          <div class="image-loading-placeholder"></div>
        </div>
      </div>
    `;
    container.appendChild(skeleton);
  }
};

export const hideCardSkeletons = () => {
  document.querySelectorAll(".card.skeleton").forEach(skeleton => {
    skeleton.classList.remove("skeleton");
  });
};
