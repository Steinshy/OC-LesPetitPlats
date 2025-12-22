import { buildDropdownsData } from "@components/dropdowns/data.js";
import { dropdownsElements, dropdownSearchElements } from "@components/dropdowns/elements.js";
import { interactionsHandlers } from "@components/dropdowns/interactions.js";
import {
  updateDropdownList,
  stickyDropdowns,
  setupDropdownListeners,
} from "@components/dropdowns/manager.js";
import { renderDropdown } from "@components/dropdowns/render.js";
import { scrollLock } from "@components/scroll.js";
import { dropdownsSkeleton } from "@components/skeletons/manager.js";
import { eventBus } from "@utils/eventBus.js";

export let currentDropdownsData = {};
export const dropdownTypes = [];
export const dropdownsLabels = [
  { name: "Ingrédients", type: "ingredients" },
  { name: "Appareils", type: "appliances" },
  { name: "Ustensiles", type: "utensils" },
];

export const onFiltersUpdated = ({ filtered }) => {
  const dropdownData = buildDropdownsData(filtered);
  Object.keys(currentDropdownsData).forEach(key => delete currentDropdownsData[key]);
  Object.assign(currentDropdownsData, dropdownData.dropdowns || {});

  dropdownTypes.forEach(type => {
    const { searchInput } = dropdownSearchElements(type);
    if (searchInput && "value" in searchInput) {
      /** @type {HTMLInputElement} */ (searchInput).value = "";
    }
    updateDropdownList(type);
  });
};

export const setupDropdowns = recipes => {
  if (!recipes) return () => {};

  const { containers } = dropdownsElements();
  if (!containers) return () => {};

  scrollLock.unlock();

  const dropdownsData = buildDropdownsData(recipes);
  currentDropdownsData = dropdownsData.dropdowns || {};
  dropdownTypes.length = 0;
  dropdownTypes.push(...Object.keys(currentDropdownsData));

  dropdownsSkeleton().show();

  containers.innerHTML = dropdownsLabels.map(dropdown => renderDropdown(dropdown)).join("");

  dropdownsSkeleton().hide();
  const cleanupListeners = setupDropdownListeners(dropdownTypes);

  dropdownTypes.forEach(type => {
    updateDropdownList(type);
  });

  document.addEventListener("keydown", interactionsHandlers.escapeKey);
  document.addEventListener("click", interactionsHandlers.click);
  window.addEventListener("resize", stickyDropdowns);
  eventBus.on("filters:updated", onFiltersUpdated);

  return () => {
    if (cleanupListeners) {
      cleanupListeners();
    }
    document.removeEventListener("keydown", interactionsHandlers.escapeKey);
    document.removeEventListener("click", interactionsHandlers.click);
    window.removeEventListener("resize", stickyDropdowns);
    eventBus.off("filters:updated", onFiltersUpdated);
  };
};
