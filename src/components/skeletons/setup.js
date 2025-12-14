import {
  searchSkeleton,
  headerSkeleton,
  dropdownsSkeleton,
  cardsSkeletons,
} from "@components/skeletons/manager.js";

export const setupSkeletons = () => {
  headerSkeleton().show();
  searchSkeleton().show();
  dropdownsSkeleton().show();
  cardsSkeletons().show();
};
