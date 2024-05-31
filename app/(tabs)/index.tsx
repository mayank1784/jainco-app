import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
export default function Index() {
  return (
    <SafeAreaView className="h-full bg-zinc-150 px-4">
      <View className="flex flex-row justify-start items-center gap-6">
        {/* <Image source={images.logo} resizeMode="contain" className="w-6 h-6" /> */}
        <View className="flex flex-row justify-center items-center h-20 w-20">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View className="flex flex-col justify-center items-center">
          <Text className="text-black font-lbold text-4xl">JAINCO DECOR</Text>
          <Text className="text-lg text-black font-rregular">
            Decor your Dream Home
          </Text>
        </View>
      </View>
      <View className="mt-4">
      <SearchInput/></View>
    </SafeAreaView>
  );
}
