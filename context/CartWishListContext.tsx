import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/lib/types";
import { Alert } from "react-native";
interface CartItem {
  skuId: string;
  name: string;
  category: string;
  qty: number;
}
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
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

export const CartWishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load cart and wishlist from AsyncStorage on component mount
  useEffect(() => {
    const loadCartAndWishlist = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        const storedWishlist = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      } catch (error) {
        console.error("Failed to load cart and wishlist from storage", error);
      }
    };

    loadCartAndWishlist();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to storage", error);
      }
    };

    saveCart();
    console.log("cart", cart);
    
  }, [cart]);

  // Save wishlist to AsyncStorage whenever it changes
  useEffect(() => {
    const saveWishlist = async () => {
      try {
        await AsyncStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify(wishlist)
        );
      } catch (error) {
        console.error("Failed to save wishlist to storage", error);
      }
    };

    saveWishlist();
  }, [wishlist]);

  const addToCart = (product: CartItem) => {
    // Check if the product already exists in the cart
    const isDuplicate = cart.some((item) => item.skuId === product.skuId);

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

  const removeFromCart = (skuId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.skuId !== skuId));
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
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart from storage", error);
    }
  };

  const clearWishList = async () => {
    // Add clearCart function
    try {
      await AsyncStorage.removeItem(WISHLIST_STORAGE_KEY);
      setWishlist([]);
    } catch (error) {
      console.error("Failed to clear wishlist from storage", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      <WishlistContext.Provider
        value={{ wishlist, addToWishlist, removeFromWishlist, clearWishList }}
      >
        {children}
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
};
