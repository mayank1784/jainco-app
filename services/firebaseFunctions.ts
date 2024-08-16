import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the import path as needed
import { Product, Variation } from "@/lib/types";

export const fetchProductData = async ({ id }: { id: string }):Promise<Product> => {
  try {
    // Fetch product by id
    const productRef = doc(db, "products", id);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      throw new Error("Product not found");
    }

    const productData = productDoc.data();

    if (!productData) {
      throw new Error("Product data is undefined");
    }

    // Add product id to the data
    const result:Product = {
        id: productDoc.id,
        ...productData as Omit<Product, 'id'>
      };

    // Populate category field with category name
    if (result.category) {
      const categoryRef = doc(db, "categories", productData.category);
      const categoryDoc = await getDoc(categoryRef);
      if (categoryDoc.exists()) {
        result.category = categoryDoc.data()?.name || result.category;
      }
    }

    // Fetch and populate variations subcollection if it exists
    const variationsRef = collection(
      db,
      "products",
      productDoc.id,
      "variations"
    );
    const variationsSnapshot = await getDocs(variationsRef);

    if (!variationsSnapshot.empty) {
        result.variations = variationsSnapshot.docs.map(doc => {
          const variationData = doc.data() as Omit<Variation, 'id'>; // Exclude 'id' from doc.data()
          return {
            id: doc.id,
            ...variationData // Spread remaining properties
          };
        });
      }
    console.log('product data fetched')
    return result;
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error;
  }
};
