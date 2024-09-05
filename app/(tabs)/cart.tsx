import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartContext } from "@/context/CartWishListContext";
import { CartItem } from "@/lib/types";
import { icons } from "@/constants";

// StyledRenderItem component
const StyledRenderItem: React.FC<{
  item: CartItem;
  updateCartItemQuantity: (
    productId: string,
    newQuantity: number,
    variationId?: string
  ) => void;
  removeFromCart: (productId: string, variationId?: string) => void;
}> = ({ item, updateCartItemQuantity, removeFromCart }) => {
  const imageUrl =
    "variationImage" in item && item.variationImage
      ? item.variationImage
      : item.productMainImage;

  const [quantity, setQuantity] = useState<number>(item.qty);

  useEffect(() => {
    updateCartItemQuantity(
      item.productId,
      quantity,
      "variationId" in item ? item.variationId : undefined
    );
  }, [quantity]);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="flex flex-col p-4 mb-4 bg-white rounded-lg shadow">
      <Text className="text-base font-rregular text-black capitalize mb-2">
        {item.productName}
      </Text>
      <View className="flex flex-row justify-between items-center ">
        <Image
          source={{ uri: imageUrl }}
          className="w-24 h-24 mr-4 rounded-lg"
        />
        <View className="flex-1">
          {"sku" in item && (
            <Text className="text-sm text-primary-300 font-iregular">
              SKU: {item.sku}
            </Text>
          )}
          <Text className="text-sm text-green-600 font-iregular">
            Price: ₹{item.price}
          </Text>
          <Text className="text-sm text-primary-300 font-iregular">
            Quantity:
          </Text>
          <View className="flex-row items-center justify-start">
            <TouchableOpacity
              className="h-4 w-4 rounded-full mr-2"
              onPress={() => setQuantity((prevQty) => Math.max(1, prevQty - 1))}
            >
              <Image
                source={icons.remove}
                className="w-full h-full"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TextInput
              className="border border-gray-300 rounded-md px-2 py-1 text-center"
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={(text) => {
                const parsedQuantity = parseInt(text, 10);
                // Ensure the quantity is not less than 1
                if (!isNaN(parsedQuantity) && parsedQuantity >= 1) {
                  setQuantity(parsedQuantity);
                } else {
                  setQuantity(1); // Reset to 1 if the user enters a value less than 1 or invalid input
                }
              }}
              onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
            />

            <TouchableOpacity
              className="h-4 w-4 rounded-full ml-2"
              onPress={() => setQuantity((prevQty) => prevQty + 1)}
            >
              <Image
                source={icons.add}
                className="w-full h-full"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-red-500 py-2 px-4 rounded-lg"
          onPress={() =>
            removeFromCart(
              item.productId,
              "variationId" in item ? item.variationId : undefined
            )
          }
        >
          <Text className="text-white text-sm">Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// CartSummary component
const CartSummary: React.FC<{ total: number }> = ({ total }) => {
  return (
    <View className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow">
      <Text className="text-xl font-semibold">Total:</Text>
      <Text className="text-xl font-semibold">₹{total}</Text>
    </View>
  );
};

// Cart component
const Cart: React.FC<any> = () => {
  const { cart, clearCart, updateCartItemQuantity, removeFromCart } =
    useContext(CartContext) || {
      cart: [],
      clearCart: () => {},
      updateCartItemQuantity: () => {},
      removeFromCart: () => {},
    };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <SafeAreaView className="flex-1 bg-zinc-150 p-4 h-full w-full">
       {/* <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    > */}
        <FlatList
          data={cart}
          renderItem={({ item }) => (
            <StyledRenderItem
              item={item}
              updateCartItemQuantity={updateCartItemQuantity}
              removeFromCart={removeFromCart}
            />
          )}
          keyExtractor={(item) => ("sku" in item ? item.sku : item.productId)}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <CartSummary total={total} />
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default Cart;
