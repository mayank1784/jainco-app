import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Points() {
  return (
    <SafeAreaView className="h-full bg-zinc-150 w-full">
      <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-iregular items-center ">Points</Text>
      </View>
    </SafeAreaView>
  );
}
