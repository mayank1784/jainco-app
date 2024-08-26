import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart: React.FC<any> = () => {
  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full justify-center items-center">
      <Text className="text-xl font-iregular text-primary-300">Cart</Text>
    </SafeAreaView>
  );
};

export default Cart;
