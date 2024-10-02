import React, { useContext } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { CartContext, WishlistContext } from "@/context/CartWishListContext";
import { icons } from "@/constants";
import { router } from "expo-router";

const CartWishlistIcons: React.FC = () => {
  const cartContext = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);

  if (!cartContext || !wishlistContext) {
    throw new Error("CartContext or WishlistContext not found");
  }

  const { cart } = cartContext;
  const { wishlist } = wishlistContext;

  return (
    <View className="flex flex-row justify-between items-center">
      <View className="relative">
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Image
            source={icons.cart}
            className="w-8 h-8"
            style={{ tintColor: cart.length ? "#dcb46a" : "#848484" }}
          />
          {cart.length > 0 && (
            <View
              className="absolute top-0 right-0 min-w-2 min-h-2 bg-red-500 rounded-full justify-center items-center"
              style={{ padding: 1 }}
            >
              <Text style={{ fontSize: 9 }} className="text-white">
                {cart.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* <View className="relative">
        <TouchableOpacity>
          <Image
            source={icons.wishlistcart}
            className="w-8 h-8"
            style={{ tintColor: wishlist.length ? "#dcb46a" : "#848484" }}
          />
          {wishlist.length > 0 && (
            <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default CartWishlistIcons;
