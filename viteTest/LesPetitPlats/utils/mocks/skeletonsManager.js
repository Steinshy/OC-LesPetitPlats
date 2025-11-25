// Test wrapper for skeletonsManager - adds wrapper functions without modifying source
export * from "@/components/skeletonsManager.js";
import {
  searchSkeleton,
  dropdownsContainerSkeleton,
  cardSkeletons,
} from "@/components/skeletonsManager.js";

// Export wrapper functions for test compatibility
export const showSearchSkeleton = () => {
  searchSkeleton().show();
};

export const hideSearchSkeleton = () => {
  searchSkeleton().hide();
};

export const showDropdownsSkeletons = () => {
  dropdownsContainerSkeleton().show();
};

export const hideDropdownsSkeletons = () => {
  dropdownsContainerSkeleton().hide();
};

export const buildCardSkeletons = count => {
  cardSkeletons().build(count);
};

export const hideCardSkeletons = () => {
  cardSkeletons().hide();
};
