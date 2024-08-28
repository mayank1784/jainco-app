import { Variation, VariationType, VariationTypes } from "./types";

// Function to generate the cartesian product of the variation types
function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
    [[]] as string[][]
  );
}


// Utility function to sort object keys and convert to a string
function stringifyVariationType(variationType: Record<string, string>): string {
  const sortedKeys = Object.keys(variationType).sort();
  const sortedObj = sortedKeys.reduce((obj, key) => {
    obj[key] = variationType[key];
    return obj;
  }, {} as Record<string, string>);
  return JSON.stringify(sortedObj);
}

// Main function to find unavailable combinations
export const findUnavailableCombinations = (
  variationTypes: VariationTypes,
  variations:Variation[]
): { combination: Record<string, string>; reason: string }[] => {
  const keys = Object.keys(variationTypes);
  const values = keys.map(key => variationTypes[key]);

  // Generate all possible combinations
  const allCombinations = cartesianProduct(values).map(combination => 
    keys.reduce((obj, key, index) => {
      obj[key] = combination[index];
      return obj;
    }, {} as Record<string, string>)
  );

  // Create a map of available variations for quick lookup
  const availableCombinationsMap = new Map<string, { isAvailable: boolean; stock: number }>(
    variations.map(v => [stringifyVariationType(v.variationType), { isAvailable: v.isAvailable, stock: v.stock }])
  );

  // Initialize the array for storing unavailable combinations
  const unavailableCombinations: { combination: Record<string, string>; reason: string }[] = [];

  // Check all possible combinations
  for (const combination of allCombinations) {
    const combinationStr = stringifyVariationType(combination);
    const available = availableCombinationsMap.get(combinationStr);

    if (!available) {
      unavailableCombinations.push({
        combination,
        reason: "Missing",
      });
    } else if (!available.isAvailable) {
      unavailableCombinations.push({
        combination,
        reason: "Unavailable",
      });
    } else if (available.stock <= 0) {
      unavailableCombinations.push({
        combination,
        reason: "Out of stock",
      });
    }
  }

  return unavailableCombinations;
};