// Test wrapper for dropdown render - adds missing exports for tests
export * from "@/components/dropdown/render.js";
import { dropdownsSkeleton } from "@/components/renderSqueletons.js";

// Re-export for test compatibility
export const renderDropdownsSkeletons = dropdownsSkeleton;
