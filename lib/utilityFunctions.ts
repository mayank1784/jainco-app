import { Variation, VariationType, VariationTypes } from "./types";

// Function to generate the cartesian product of the variation types
function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
    [[]] as string[][]
  );
}

// Function to find all unavailable variations of a product
export const findUnavailableCombinations = (
  variationTypes: VariationTypes,
  variations: Variation[]
): { combination: VariationType; reason: string }[] => {
  const keys = Object.keys(variationTypes);
  const allCombinations = cartesianProduct(
    keys.map((key) => variationTypes[key])
  );

  const availableCombinations = variations.reduce((set, variation) => {
    set.add(JSON.stringify(variation.variationType));
    return set;
  }, new Set<string>());

  const unavailableCombinations: {
    combination: VariationType;
    reason: string;
  }[] = [];

  for (const combination of allCombinations) {
    const combinationObj = keys.reduce((obj, key, index) => {
      obj[key] = combination[index];
      return obj;
    }, {} as VariationType);

    const combinationStr = JSON.stringify(combinationObj);

    // Check if the combination is missing or is available = false
    const variation = variations.find(
      (v) => JSON.stringify(v.variationType) === combinationStr
    );

    if (!variation) {
      unavailableCombinations.push({
        combination: combinationObj,
        reason: "Missing",
      });
    } else if (!variation.isAvailable) {
      unavailableCombinations.push({
        combination: combinationObj,
        reason: "Unavailable",
      });
    } else if (variation.stock <= 0) {
      unavailableCombinations.push({
        combination: combinationObj,
        reason: "Out of stock",
      });
    }
  }

  return unavailableCombinations;
};
