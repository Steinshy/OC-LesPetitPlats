import { selectRandomImages } from "../../utils/deliveryImages.js";
import { showSearchSkeleton, hideSearchSkeleton } from "../skeletons.js";
import { searchSection } from "./render.js";

const toggleSearchState = isEnabled => {
  const searchSection = document.getElementById("search-section");
  if (!searchSection) return;

  searchSection.classList.toggle("disabled", !isEnabled);
  isEnabled ? hideSearchSkeleton() : showSearchSkeleton();
};

export const setupSearchSection = recipesData => {
  const header = document.getElementById("header");
  if (!header) return;

  const searchSectionElement = document.getElementById("search-section");
  const imageData = recipesData?.length ? selectRandomImages(recipesData) : null;
  const searchSectionHTML = searchSection(imageData);

  if (searchSectionElement) {
    searchSectionElement.outerHTML = searchSectionHTML;
  } else {
    header.insertAdjacentHTML("beforeend", searchSectionHTML);
  }

  const searchInput = document.getElementById("recipe-search");
  const clearBtn = document.getElementById("clear-recipe-search");

  const emitSearchChange = () => {
    const query = searchInput?.value || "";

    // 🔗 talk to filters manager
    const event = new CustomEvent("filters:searchChanged", {
      detail: { query },
    });
    document.dispatchEvent(event);

    const hasText = query.trim().length > 0;
    if (clearBtn) {
      clearBtn.classList.toggle("hidden", !hasText);
    }
  };

  searchInput.addEventListener("input", emitSearchChange);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      emitSearchChange();
      searchInput.focus();
    });
  }

  // Hide placeholder skeleton when background image loads
  if (imageData?.jpgUrl || imageData?.webpUrl) {
    const testImg = new Image();
    const hidePlaceholder = () => {
      document.querySelector(".header-image-placeholder")?.classList.add("hidden");
    };

    testImg.onload = hidePlaceholder;
    testImg.onerror = hidePlaceholder; // Hide on error to prevent permanent skeleton
    testImg.src = imageData.webpUrl || imageData.jpgUrl;
  }

  toggleSearchState(true);
};
