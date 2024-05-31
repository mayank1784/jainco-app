import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function QR() {
  return (
    <SafeAreaView className="h-full bg-secondary">
      <Text className="text-2xl font-lbold items-center text-black">QR</Text>
    </SafeAreaView>
  );
}
