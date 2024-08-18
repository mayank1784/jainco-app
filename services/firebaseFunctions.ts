import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the import path as needed
import { Product, Variation } from "@/lib/types";


  // export const fetchProductData = (
  //   { id }: { id: string },
  //   onUpdate: (product: Product | null, error?: Error) => void
  // ): (() => void) => {
  //   const productRef = doc(db, "products", id);
    
  //   // Listener for product document
  //   const unsubscribeProduct = onSnapshot(productRef, async (productDoc) => {
  //     try {
  //       if (!productDoc.exists()) {
  //         throw new Error("Product not found");
  //       }
  
  //       const productData = productDoc.data();
  //       if (!productData) {
  //         throw new Error("Product data is undefined");
  //       }
  
  //       const result: Product = {
  //         id: productDoc.id,
  //         ...productData as Omit<Product, 'id'>,
  //       };
  
  //       // Fetch category
  //       if (result.category) {
  //         const categoryRef = doc(db, "categories", productData.category);
  //         const categoryDoc = await getDoc(categoryRef);
  //         if (categoryDoc.exists()) {
  //           result.category = categoryDoc.data()?.name || result.category;
  //         }
  //       }
  
  //       // Set up listener for variations subcollection
  //       const variationsRef = collection(db, "products", productDoc.id, "variations");
  //       const unsubscribeVariations = onSnapshot(variationsRef, (variationsSnapshot) => {
  //         try {
  //           result.variations = variationsSnapshot.docs.map((doc) => {
  //             const variationData = doc.data() as Omit<Variation, "id">;
  //             return {
  //               id: doc.id,
  //               ...variationData,
  //             };
  //           });

  //           // If no variations are found, set result.variations to an empty array
  //           if (result.variations.length === 0) {
  //            delete result.variations
  //           }
  
  //           // Call the onUpdate callback with the updated product data
  //           onUpdate(result);
  //         } catch (error) {
          
  //           if (error instanceof Error) {
  //             onUpdate(null, error);
  //           } else {
  //             onUpdate(null, new Error("An unexpected error occurred."));
  //           }
  //         }
  //       });
  
  //       // Call the onUpdate callback with the initial product data
  //       onUpdate(result);
  
  //       // Return a cleanup function that unsubscribes both listeners
  //       return () => {
  //         unsubscribeProduct();
  //         unsubscribeVariations();
  //       };
  //     } catch (error) {
        
  //       if (error instanceof Error) {
  //         onUpdate(null, error);
  //       } else {
  //         onUpdate(null, new Error("An unexpected error occurred."));
  //       }
  //     }
  //   });

  //   // Return the function to unsubscribe from the product listener
  //   return unsubscribeProduct;
  // };

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
          ...productData as Omit<Product, 'id'>,
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
    
  