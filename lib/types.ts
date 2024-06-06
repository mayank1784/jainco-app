// types.ts
interface Variations {
  // [key: string]: string[] | (string | string[])[];
  [key: string]: (string | [string, string])[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  lowerPrice: number;
  upperPrice: number;
  mainImage: string;
  // otherImages: string[]; optional attribute
  variations: Variations;
  keywords: string[];
  [key: string]: any; // For any additional dynamic properties
}
export interface Category {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
}

export interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishList: () => void;
}
