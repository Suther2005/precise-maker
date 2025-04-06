import { ingredientDatabase } from '../data/ingredients';
import Fuse from 'fuse.js';

// Initialize Fuse.js for fuzzy searching with proper typing
const searchableItems = [
  ...Object.keys(ingredientDatabase),
  ...Object.entries(ingredientDatabase).flatMap(([_, data]) => data.alternatives)
];

const ingredientFuse = new Fuse(searchableItems, {
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true, // This helps with matching ingredients regardless of word position
  useExtendedSearch: true // Enables more flexible matching
});

// Function to find the best matching ingredient with fuzzy search
export function findIngredient(query: string): string | null {
  if (!query?.trim()) return null;
  
  try {
    // Direct match
    if (ingredientDatabase[query.toLowerCase()]) {
      return query.toLowerCase();
    }
    
    // Fuzzy search with better error handling
    const results = ingredientFuse.search(query.toLowerCase());
    if (results && results.length > 0) {
      const bestMatch = results[0].item as string;
      
      // If it's an alternative name, find the main ingredient
      for (const [ingredient, data] of Object.entries(ingredientDatabase)) {
        if (ingredient === bestMatch) {
          return ingredient;
        }
        if (data.alternatives.includes(bestMatch)) {
          return ingredient;
        }
      }
      
      return bestMatch;
    }
    
    return null;
  } catch (error) {
    console.error("Error while searching for ingredient:", error);
    return null;
  }
}

// Function to calculate grams based on ingredient, amount, and unit
export function calculateGrams(
  ingredientName: string,
  amount: number,
  unit: string
): number {
  const matchedIngredient = findIngredient(ingredientName);
  
  if (!matchedIngredient) {
    return 0; // Could display an error instead
  }
  
  const ingredient = ingredientDatabase[matchedIngredient];
  
  // Get the correct density based on the unit
  const unitDensity = ingredient.density[unit as keyof typeof ingredient.density];
  
  if (unitDensity === undefined) {
    return 0; // Could display an error instead
  }
  
  return amount * unitDensity;
}

// Natural language input parser
export function parseNaturalLanguageInput(input: string): { ingredient: string; amount: number; unit: string } | null {
  // Simple regex pattern to extract amount, unit, and ingredient
  const pattern = /(?:convert\s+)?(\d+(?:\.\d+)?)\s+(cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|ounce|ounces|oz|pinch|pinches)\s+(?:of\s+)?(.+)(?:\s+to\s+grams)?/i;
  const match = input.match(pattern);
  
  if (!match) return null;
  
  const amount = parseFloat(match[1]);
  let unit = match[2].toLowerCase();
  const ingredientQuery = match[3].trim();
  
  // Normalize unit names
  if (unit === 'cups') unit = 'cup';
  if (unit === 'tablespoons' || unit === 'tbsp') unit = 'tablespoon';
  if (unit === 'teaspoons' || unit === 'tsp') unit = 'teaspoon';
  if (unit === 'ounces' || unit === 'oz') unit = 'ounce';
  if (unit === 'pinches') unit = 'pinch';
  
  const ingredient = findIngredient(ingredientQuery);
  
  if (!ingredient) return null;
  
  return {
    ingredient,
    amount,
    unit
  };
}
