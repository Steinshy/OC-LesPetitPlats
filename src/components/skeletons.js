export const getSkeletonList = count => Array.from({ length: count }, () => ({}));

const selectors = {
  searchHeader: ".search-header",
  searchBarGroup: ".search-bar-group",
  searchSection: ".search-section",
};

const getElement = key => document.querySelector(selectors[key]);

const toggleSearchSkeleton = isEnabled => {
  [getElement("searchHeader"), getElement("searchBarGroup")]
    .filter(Boolean)
    .forEach(element => element.classList.toggle("skeleton-loading", isEnabled));
};

const toggleHeaderSkeleton = isEnabled => {
  const searchSection = getElement("searchSection");
  if (!searchSection) return;
  searchSection.classList.toggle("skeleton-loading", isEnabled);
};

export const showSearchSkeleton = () => toggleSearchSkeleton(true);
export const hideSearchSkeleton = () => toggleSearchSkeleton(false);

export const renderHeaderSkeleton = () => toggleHeaderSkeleton(true);
export const hideHeaderSkeleton = () => toggleHeaderSkeleton(false);
