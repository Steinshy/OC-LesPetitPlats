import {
  searchSkeleton,
  heroSkeleton,
  dropdownsSkeleton,
  cardsSkeletons,
} from "@components/skeletons/manager.js";

export const setupSkeletons = () => {
  heroSkeleton().show();
  searchSkeleton().show();
  dropdownsSkeleton().show();
  cardsSkeletons().show();
};
