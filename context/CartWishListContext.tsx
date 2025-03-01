import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system'
import { CartItemWithVariations, Product } from "@/lib/types";
import { Alert } from "react-native";
import { CartItem } from "@/lib/types";


interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string, variationId:string) => void;
  clearCart: () => void;
  updateCartItemQuantity: (productId: string, newQuantity: number, variationId: string) => void;
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishList: () => void;
}

// Create contexts
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);
const CART_STORAGE_KEY = "cart";
const WISHLIST_STORAGE_KEY = "wishlist";
const CART_FILE_NAME = "cart.json";
const WISHLIST_FILE_NAME = "wishlist.json"

export const CartWishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);


  // // Load cart and wishlist from AsyncStorage on component mount
  // useEffect(() => {
  //   const loadCartAndWishlist =  () => {
  //     try {
  //       const storedCart =  storage.contains(CART_STORAGE_KEY);
  //       const storedWishlist = storage.contains(WISHLIST_STORAGE_KEY);
  //       if (storedCart){
  //         const cartItems = storage.getString(CART_STORAGE_KEY)
  //         cartItems && setCart(JSON.parse(cartItems));}
  //       if (storedWishlist){
  //         const wishItems = storage.getString(WISHLIST_STORAGE_KEY)
  //         wishItems && setWishlist(JSON.parse(wishItems));}
  //     } catch (error) {
  //       console.error("Failed to load cart and wishlist from storage", error);
  //     }
  //   };

  //   loadCartAndWishlist();
  // }, []);

  useEffect(() => {
    const loadCartAndWishlist = async () => {
      try {
        const cartFileUri = `${FileSystem.documentDirectory}${CART_FILE_NAME}`;
        const wishlistFileUri = `${FileSystem.documentDirectory}${WISHLIST_FILE_NAME}`;
  
        // Check if files exist, and create new files if not
        const [cartFileInfo, wishlistFileInfo] = await Promise.all([
          FileSystem.getInfoAsync(cartFileUri),
          FileSystem.getInfoAsync(wishlistFileUri),
        ]);
  
        if (!cartFileInfo.exists) {
          await FileSystem.writeAsStringAsync(cartFileUri, '[]');
        }
  
        if (!wishlistFileInfo.exists) {
          await FileSystem.writeAsStringAsync(wishlistFileUri, '[]');
        }
  
        // Load cart and wishlist from files
        const [cartFile, wishlistFile] = await Promise.all([
          FileSystem.readAsStringAsync(cartFileUri),
          FileSystem.readAsStringAsync(wishlistFileUri),
        ]);
  
        setCart(JSON.parse(cartFile));
        setWishlist(JSON.parse(wishlistFile));
      } catch (error) {
        console.error("Failed to load cart and wishlist from file system", error);
      }
    };
  
    loadCartAndWishlist();
  }, []);

  // // Save cart to AsyncStorage whenever it changes
  // useEffect(() => {
  //   const saveCart = () => {
  //     try {
  //       storage.set(CART_STORAGE_KEY, JSON.stringify(cart));
  //     } catch (error) {
  //       console.error("Failed to save cart to storage", error);
  //     }
  //   };

  //   saveCart();
  // }, [cart]);

  // // Save wishlist to AsyncStorage whenever it changes
  // useEffect(() => {
  //   const saveWishlist =  () => {
  //     try {
  //        storage.set(
  //         WISHLIST_STORAGE_KEY,
  //         JSON.stringify(wishlist)
  //       );
  //     } catch (error) {
  //       console.error("Failed to save wishlist to storage", error);
  //     }
  //   };

  //   saveWishlist();
  // }, [wishlist]);

useEffect(()=>{
if (cart.length){
  console.log(JSON.stringify(cart,null,2))
}
},[cart])

// Save cart to file system whenever it changes
 useEffect(() => {
      const saveCart = async () => {
        try {
          const cartFileUri = `${FileSystem.documentDirectory}${CART_FILE_NAME}`;
          await FileSystem.writeAsStringAsync(cartFileUri, JSON.stringify(cart));
        } catch (error) {
          console.error("Failed to save cart to file system", error);
        }
      };
  
      saveCart();
    }, [cart]);
  
    // Save wishlist to file system whenever it changes
    useEffect(() => {
      const saveWishlist = async () => {
        try {
          const wishlistFileUri = `${FileSystem.documentDirectory}${WISHLIST_FILE_NAME}`;
          await FileSystem.writeAsStringAsync(wishlistFileUri, JSON.stringify(wishlist));
        } catch (error) {
          console.error("Failed to save wishlist to file system", error);
        }
      };
  
      saveWishlist();
    }, [wishlist]);


  const addToCart = (product: CartItem) => {
    // Check if the product already exists in the cart
    const isDuplicate = cart.some((item) => {

      if(item.productId === product.productId && item.variationId === product.variationId){
        return true;
      }
      return false;
      // // Check if the productId matches
      // if (item.productId !== product.productId) {
      //   return false;
      // }

      // // Check if the product has variations
      // if ("variationId" in product) {
      //   // Product has variations, check if the item also has variations and if variationId matches
      //   return (
      //     "variationId" in item && item.variationId === product.variationId
      //   );
      // }

      // // Product does not have variations, item should not have a variationId
      // return !("variationId" in item);
    });

    if (isDuplicate) {
      // Show alert for duplicate item
      Alert.alert(
        "Duplicate Item",
        "This item is already in your cart.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      // Add the product to the cart if not a duplicate
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  const removeFromCart = (productId: string, variationId?: string) => {
    const updatedCart = cart.filter((item) => {
      // Case 1: Both productId and variationId are passed
      if (variationId) {
        // Return true if the item does not match both productId and variationId
        return !(
          item.productId === productId && 
          (item as CartItemWithVariations).variationId === variationId
        );
      } 
      // Case 2: Only productId is passed
      else {
        // Return true if the item does not match the productId
        return item.productId !== productId;
      }
    });
  
    setCart(updatedCart);
  };
  
  const updateCartItemQuantity = (productId: string, newQuantity: number, variationId?: string) => {
    const updatedCart = cart.map((item) => {
      // Case 1: Both productId and variationId are passed
      if (variationId) {
        if (
          item.productId === productId && 
          (item as CartItemWithVariations).variationId === variationId
        ) {
          // Update the quantity for the matching item
          return { ...item, qty: newQuantity, amount: newQuantity * item.price };
        }
      } 
      // Case 2: Only productId is passed
      else {
        if (item.productId === productId) {
          // Update the quantity for the matching item
          return { ...item, qty: newQuantity, amount: newQuantity * item.price };
        }
      }
      return item; // Return the item unchanged if it doesn't match
    });
  
    setCart(updatedCart);
  };
  

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  const clearCart = async () => {
    // Add clearCart function
    try {
      const CART_URI = `${FileSystem.documentDirectory}${CART_FILE_NAME}`
      await FileSystem.deleteAsync(CART_URI)
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart from storage", error);
    }
  };

  const clearWishList = async () => {
    // Add clearCart function
    try {
      const WISHLIST_URI = `${FileSystem.documentDirectory}${WISHLIST_FILE_NAME}`
      await FileSystem.deleteAsync(WISHLIST_URI)
      setWishlist([]);
    } catch (error) {
      console.error("Failed to clear wishlist from storage", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateCartItemQuantity }}
    >
      <WishlistContext.Provider
        value={{ wishlist, addToWishlist, removeFromWishlist, clearWishList }}
      >
        {children}
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
};
