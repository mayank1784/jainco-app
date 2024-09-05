export interface Product {
  id: string;
  name: string;
  lowerPrice: number;
  upperPrice: number;
  category: string;
  description: string;
  mainImage: string;
  otherImages?: string[];
  createdAt: CreatedAt;
  variationTypes?: VariationTypes;
  variations?: Variation[];
}

export interface ProductSmall {
  id: string;
  name: string;
  lowerPrice: number;
  upperPrice: number;
  mainImage: string;
  description: string;
  variationTypes?: string;
}
export interface Variation {
  id: string;
  variationType: VariationType;
  price: number;
  stock: number;
  isAvailable: boolean;
  sku: string;
  images?: string[];
}

export interface VariationType {
  [key: string]: string;
}

export interface VariationTypes {
  [key: string]: string[];
}

interface CreatedAt {
  seconds: number;
  nanoseconds: number;
}
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export type UnavailableCombinations = UnavailableCombination[];

export interface UnavailableCombination {
  combination: Record<string, string>;
  reason: string;
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

export interface CartItemWithVariations {
  sku: string;
  qty: number;
  productName: string;
  productId: string;
  variationId: string;
  price: number;
  productMainImage: string;
  variationImage: string;
  amount: number;
}

export interface CartItemWithoutVariations {
  qty: number;
  productName: string;
  productId: string;
  price: number;
  productMainImage: string;
  amount: number;
}

export type CartItem = CartItemWithVariations | CartItemWithoutVariations;
