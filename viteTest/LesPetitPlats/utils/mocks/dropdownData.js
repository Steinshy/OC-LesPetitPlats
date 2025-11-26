// Test wrapper for dropdown data - adapts return structure for tests
export * from "@/components/dropdown/data.js";
import { buildDropdownsData as originalBuildDropdownsData } from "@/components/dropdown/data.js";

// Wrapper that returns the structure tests expect
export const buildDropdownsData = recipesData => {
  const result = originalBuildDropdownsData(recipesData);
  // Tests expect { ingredients, ustensils, appliances } directly
  // but function returns { dropdowns: { ingredients, ustensils, appliances } }
  if (!result || !result.dropdowns) {
    return {
      ingredients: [],
      ustensils: [],
      appliances: [],
    };
  }
  return {
    ingredients: result.dropdowns.ingredients || [],
    ustensils: result.dropdowns.ustensils || [],
    appliances: result.dropdowns.appliances || [],
  };
};
