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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartContext } from "@/context/CartWishListContext";
import { CartItem, Order, OrderStatus } from "@/lib/types";
import { icons } from "@/constants";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// StyledRenderItem component
const StyledRenderItem: React.FC<{
  item: CartItem;
  updateCartItemQuantity: (
    productId: string,
    newQuantity: number,
    variationId: string
  ) => void;
  removeFromCart: (productId: string, variationId: string) => void;
}> = ({ item, updateCartItemQuantity, removeFromCart }) => {
  const imageUrl =
    "variationImage" in item && item.variationImage
      ? item.variationImage
      : item.productMainImage;

  const [quantity, setQuantity] = useState<number>(item.qty);

  useEffect(() => {
    updateCartItemQuantity(item.productId, quantity, item.variationId);
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
          onPress={() => removeFromCart(item.productId, item.variationId)}
        >
          <Text className="text-white text-sm">Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Modify CartSummary component to include Place Order button
const CartSummary: React.FC<{
  total: number;
  onPlaceOrder: () => void;
  isLoading: boolean;
}> = ({ total, onPlaceOrder, isLoading }) => {
  return (
    <View className="p-4 bg-white rounded-lg shadow">
      <View className="flex flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold">Total:</Text>
        <Text className="text-xl font-semibold">₹{total}</Text>
      </View>
      <TouchableOpacity
        className={`bg-secondary py-3 rounded-lg ${
          isLoading ? "opacity-50" : ""
        }`}
        onPress={onPlaceOrder}
        disabled={isLoading}
      >
        <Text className="text-white text-center text-lg font-bold">
          {isLoading ? "Placing Order..." : "Place Order"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Modify Cart component
const Cart: React.FC<any> = () => {
  const { cart, clearCart, updateCartItemQuantity, removeFromCart } =
    useContext(CartContext) || {
      cart: [],
      clearCart: () => {},
      updateCartItemQuantity: () => {},
      removeFromCart: () => {},
    };
  const { currentUser, profileData } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = async () => {
    if (!currentUser || !profileData) {
      Alert.alert("Error", "Please sign in to place an order");
      router.push("/sign-in");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const orderData: Omit<Order, "id"> = {
        userId: currentUser.uid,
        items: cart,
        totalAmount: total,
        status: OrderStatus.PENDING,
       
        createdAt: serverTimestamp(),
      };

      console.log(JSON.stringify(orderData,null,2))
      const ordersRef = collection(db, "orders");
      await addDoc(ordersRef, orderData);

      // Clear the cart after successful order placement
      await clearCart();

      Alert.alert("Success", "Order placed successfully!", [
        { text: "OK", onPress: () => router.push("/cart") },
      ]);
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-150 p-4 h-full w-full">
      {/* <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    > */}
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <StyledRenderItem
                item={item}
                updateCartItemQuantity={updateCartItemQuantity}
                removeFromCart={removeFromCart}
              />
            )}
            keyExtractor={(item: CartItem) => item.sku}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <CartSummary
            total={total}
            onPlaceOrder={handlePlaceOrder}
            isLoading={isPlacingOrder}
          />
        </>
      ) : (
        <>
          <View className="font-iregular flex items-center justify-center w-full h-full">
            <Text className="text-2xl">Cart is empty ! 🙁 </Text>
            <Text className="text-xl">Add your first product now...</Text>
            <TouchableOpacity
              className="bg-secondary rounded-2xl py-4 px-4 mt-4"
              onPress={() => {
                router.push("/");
              }}
            >
              <Text className="text-center text-white text-xl font-bold">
                Find Products
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default Cart;
