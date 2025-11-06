export const getSkeletonList = count => Array.from({ length: count }, () => ({}));

const selectors = {
  searchHeader: ".search-header",
  searchBarGroup: ".search-bar-group",
};

const getElement = key => document.querySelector(selectors[key]);

const toggleSearchSkeleton = isEnabled => {
  [getElement("searchHeader"), getElement("searchBarGroup")]
    .filter(Boolean)
    .forEach(element => element.classList.toggle("skeleton-loading", isEnabled));
};

export const hideSearchSkeleton = () => toggleSearchSkeleton(false);
