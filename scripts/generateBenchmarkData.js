import { writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Common ingredients pool
const ingredientsPool = [
  "Lait de coco",
  "Jus de citron",
  "Crème de coco",
  "Sucre",
  "Glaçons",
  "Thon Rouge",
  "Concombre",
  "Tomate",
  "Carotte",
  "Citron Vert",
  "Poulet",
  "Coulis de tomate",
  "Oignon",
  "Poivron rouge",
  "Huile d'olive",
  "Riz blanc",
  "Thon en miettes",
  "Oeuf dur",
  "Maïs",
  "Vinaigrette",
  "Pâte feuilletée",
  "Crème fraîche",
  "Gruyère râpé",
  "Moutarde de Dijon",
  "Pomme",
  "Oeuf",
  "Sucre en Poudre",
  "Sucre vanillé",
  "Pâte sablée",
  "Chocolat au lait",
  "Crème liquide",
  "Beurre",
  "Fraise",
  "Noix",
  "Chocolat noir",
  "Farine",
  "Fromage de chèvre",
  "Olives",
  "Vinaigre Balsamic",
  "Basilic",
  "Reblochon",
  "Pommes de terre",
  "Jambon fumé",
  "Vin blanc sec",
  "Tomates cerises",
  "Mozzarella",
  "Jambon de parme",
  "Salade Verte",
  "Rhubarbe",
  "Eau",
  "Mâche",
  "Échalote",
  "Vinaigre de cidre",
  "Saucisse bretonne",
  "Farine de blé noir",
  "Fromage à raclette",
  "Banane",
  "Lait",
  "Beurre salé",
  "Kiwi",
  "Sucre glace",
  "Tagliatelles",
  "Lardons",
  "Parmesan",
  "Spaghettis",
  "Viande hachée",
  "Vin rouge",
  "Pâte brisée",
  "Citron",
  "Lait",
  "Pois chiches",
  "Ail",
  "Paprika",
  "Pois Cassé",
  "Haricots verts",
  "Petits poids",
  "Pain de mie",
  "Blanc de dinde",
  "Emmental",
  "Noix de muscade",
  "Saumon Fumé",
  "Feuilles de laitue",
  "Fromage blanc",
  "Patate douce",
  "Courgette",
  "Lasagnes",
  "Maïzena",
  "Pastèque",
  "Menthe",
  "Ananas",
  "Glace à la vanille",
  "Pennes",
  "Pâte à pizza",
  "Tomates pelées",
  "Champignons de paris",
  "Mangue",
  "Miel",
  "Poudre d'amandes",
  "Sucre roux",
  "Mascarpone",
  "Vermicelles",
  "Oseille",
  "Poireau",
];

// Common appliances pool
const appliancesPool = [
  "Blender",
  "Saladier",
  "Cocotte",
  "Cuiseur de riz",
  "Four",
  "Poêle à crêpe",
  "Sauteuse",
  "Casserole",
  "Mixer",
  "Poêle",
  "Moule à charlotte",
];

// Common ustensils pool
const ustensilsPool = [
  "cuillère à Soupe",
  "verres",
  "presse citron",
  "couteau",
  "saladier",
  "passoire",
  "moule à tarte",
  "râpe à fromage",
  "fouet",
  "spatule",
  "rouleau à patisserie",
  "cuillère en bois",
  "économe",
  "louche",
  "fourchette",
  "moule à gateaux",
  "casserole",
  "moule à tartelettes",
  "plat à gratin",
  "poêle à frire",
  "bol",
  "Cuillère à Soupe",
  "plaque de cuisson",
  "cocotte minute",
  "moule",
];

// Recipe name templates
const nameTemplates = [
  "Recette de {ingredient}",
  "{ingredient} à la {ingredient2}",
  "Salade de {ingredient}",
  "Tarte aux {ingredient}",
  "Gratin de {ingredient}",
  "Soupe à la {ingredient}",
  "Purée de {ingredient}",
  "Smoothie {ingredient}",
  "Crêpes {ingredient}",
  "Pâtes {ingredient}",
  "Cake {ingredient}",
  "Quiche {ingredient}",
  "Lasagne {ingredient}",
  "Pizza {ingredient}",
  "Mousse {ingredient}",
];

// Description templates
const descriptionTemplates = [
  "Préparer les ingrédients. Cuire selon les instructions. Servir chaud.",
  "Mélanger tous les ingrédients dans un récipient. Laisser reposer. Cuire au four.",
  "Découper les légumes. Faire revenir dans une poêle. Ajouter les épices.",
  "Faire cuire les pâtes. Préparer la sauce séparément. Mélanger et servir.",
  "Éplucher et couper les ingrédients. Mettre dans un plat. Cuire environ 30 minutes.",
];

// Units pool
const unitsPool = [
  "ml",
  "cl",
  "litres",
  "grammes",
  "kg",
  "cuillères à soupe",
  "cuillères à café",
  "tranches",
  "tasses",
  "boites",
  "barquettes",
  "sachets",
  "pincées",
  "gousses",
  "tiges",
  "feuilles",
];

/**
 * Get random element from array
 */
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random elements from array
 */
function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate a random ingredient object
 */
function generateIngredient(ingredientsUsed) {
  let ingredient;
  do {
    ingredient = getRandomElement(ingredientsPool);
  } while (ingredientsUsed.has(ingredient));

  ingredientsUsed.add(ingredient);

  const hasQuantity = Math.random() > 0.1; // 90% chance of having quantity
  const hasUnit = Math.random() > 0.3; // 70% chance of having unit

  const ingredientObj = {
    ingredient,
  };

  if (hasQuantity) {
    if (Math.random() > 0.5) {
      ingredientObj.quantity = Math.floor(Math.random() * 500) + 1;
    } else {
      ingredientObj.quantity = Math.floor(Math.random() * 10) + 1;
    }

    if (hasUnit) {
      ingredientObj.unit = getRandomElement(unitsPool);
    }
  }

  return ingredientObj;
}

/**
 * Generate a fake recipe
 */
function generateRecipe(id) {
  const ingredientsUsed = new Set();
  const numIngredients = Math.floor(Math.random() * 8) + 3; // 3-10 ingredients
  const ingredients = [];

  for (let i = 0; i < numIngredients; i++) {
    ingredients.push(generateIngredient(ingredientsUsed));
  }

  // Sometimes reuse ingredients for variety
  if (Math.random() > 0.7) {
    ingredientsUsed.clear();
  }

  const appliance = getRandomElement(appliancesPool);
  const numUstensils = Math.floor(Math.random() * 5) + 2; // 2-6 ustensils
  const ustensils = getRandomElements(ustensilsPool, numUstensils);

  // Generate name
  const nameTemplate = getRandomElement(nameTemplates);
  const nameIngredient1 = getRandomElement(ingredientsPool);
  const nameIngredient2 = getRandomElement(ingredientsPool);
  const name = nameTemplate
    .replace("{ingredient}", nameIngredient1)
    .replace("{ingredient2}", nameIngredient2);

  // Generate description
  const descriptionTemplate = getRandomElement(descriptionTemplates);
  const description = descriptionTemplate;

  return {
    id,
    image: `Recette${String(id).padStart(2, "0")}.jpg`,
    name,
    servings: Math.floor(Math.random() * 8) + 1, // 1-8 servings
    ingredients,
    time: Math.floor(Math.random() * 120) + 10, // 10-130 minutes
    description,
    appliance,
    ustensils,
  };
}

/**
 * Generate benchmark data
 */
function generateBenchmarkData(count = 750) {
  console.log(`Generating ${count} fake recipes...`);

  const recipes = [];
  for (let i = 1; i <= count; i++) {
    recipes.push(generateRecipe(i));
    if (i % 100 === 0) {
      console.log(`Generated ${i} recipes...`);
    }
  }

  const outputPath = join(__dirname, "../public/api/data-benchmark.json");
  writeFileSync(outputPath, JSON.stringify(recipes, null, 2), "utf-8");

  console.log(`✓ Generated ${count} recipes`);
  console.log(`✓ Saved to ${outputPath}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const count = parseInt(process.argv[2]) || 750;
  generateBenchmarkData(count);
}

export { generateBenchmarkData };
