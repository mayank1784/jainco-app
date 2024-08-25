import {
  doc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase"; // Adjust the import path as needed
import { Category, Product, Variation, ProductSmall } from "@/lib/types";
import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";

// Initialize Firebase functions
const functions = getFunctions();

export const fetchProductSnapshot = (
  { id }: { id: string },
  onUpdate: (product: Product | null, error?: Error) => void
): (() => void) => {
  const productRef = doc(db, "products", id);

  return onSnapshot(productRef, async (productDoc) => {
    try {
      if (!productDoc.exists()) {
        throw new Error("Product not found");
      }

      const productData = productDoc.data();
      if (!productData) {
        throw new Error("Product data is undefined");
      }

      const result: Product = {
        id: productDoc.id,
        ...(productData as Omit<Product, "id">),
      };

      // Fetch category
      if (result.category) {
        const categoryRef = doc(db, "categories", productData.category);
        const categoryDoc = await getDoc(categoryRef);
        if (categoryDoc.exists()) {
          result.category = categoryDoc.data()?.name || result.category;
        }
      }

      // Call the onUpdate callback with the updated product data
      onUpdate(result);
    } catch (error) {
      if (error instanceof Error) {
        onUpdate(null, error);
      } else {
        onUpdate(null, new Error("An unexpected error occurred."));
      }
    }
  });
};
export const fetchVariationsSnapshot = (
  productId: string,
  onUpdate: (variations: Variation[] | null, error?: Error) => void
): (() => void) => {
  const variationsRef = collection(db, "products", productId, "variations");

  return onSnapshot(variationsRef, (variationsSnapshot) => {
    try {
      const variations = variationsSnapshot.docs.map((doc) => {
        const variationData = doc.data() as Omit<Variation, "id">;
        return {
          id: doc.id,
          ...variationData,
        };
      });

      // If no variations are found, set variations to an empty array
      if (variations.length === 0) {
        onUpdate([], undefined);
      } else {
        onUpdate(variations);
      }
    } catch (error) {
      if (error instanceof Error) {
        onUpdate(null, error);
      } else {
        onUpdate(null, new Error("An unexpected error occurred."));
      }
    }
  });
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const categoryCollectionRef = collection(db, "categories");
    const categorySnapshot = await getDocs(categoryCollectionRef);

    // Extract category data
    // Extract and sort category data by the 'name' property
    const categoryList: Category[] = categorySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Category)
      )
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name

    return categoryList;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

export const fetchProductsByCategory = async (
  categoryId: string
): Promise<ProductSmall[]> => {
  try {
    const fetchProducts = httpsCallable<
      { categoryId: string },
      { products: ProductSmall[] }
    >(functions, "fetchProductsByCategory");

    // Call the Firebase function with categoryId
    const result: HttpsCallableResult<{ products: ProductSmall[] }> =
      await fetchProducts({ categoryId });

    // Cast result.data to the expected shape

    return result.data.products;
  } catch (error) {
    console.error("Error calling fetchProductsByCategory:", error);
    throw error;
  }
};
