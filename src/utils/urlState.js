/**
 * URL State Management
 * Syncs application state (filters, search) with URL query parameters
 * to ensure each page/view has a unique, shareable URL
 */


export const parseURLState = () => {
  const params = new URLSearchParams(window.location.search);
  
  return {
    search: params.get("search") || "",
    ingredients: new Set(params.getAll("ingredients").filter(Boolean)),
    appliances: new Set(params.getAll("appliances").filter(Boolean)),
    ustensils: new Set(params.getAll("ustensils").filter(Boolean)),
  };
};


export const updateURLState = (state) => {
  const url = new URL(window.location);
  url.searchParams.delete("search");
  url.searchParams.delete("ingredients");
  url.searchParams.delete("appliances");
  url.searchParams.delete("ustensils");

  if (state.search) {
    url.searchParams.set("search", state.search);
  }

  state.ingredients.forEach(ingredient => {
    url.searchParams.append("ingredients", ingredient);
  });

  state.appliances.forEach(appliance => {
    url.searchParams.append("appliances", appliance);
  });

  state.ustensils.forEach(ustensil => {
    url.searchParams.append("ustensils", ustensil);
  });

  // Update URL without page reload
  window.history.pushState(
    { filters: state },
    "",
    url.pathname + url.search,
  );
};


export const clearURLState = () => {
  const url = new URL(window.location);
  url.searchParams.delete("search");
  url.searchParams.delete("ingredients");
  url.searchParams.delete("appliances");
  url.searchParams.delete("ustensils");

  window.history.pushState({}, "", url.pathname);
};

