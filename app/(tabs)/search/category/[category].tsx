import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams } from "expo-router";
import { images } from "@/constants";

const CategorySearchScreen = () => {
  const { category } = useLocalSearchParams<{ category: string }>();

  return (
    <SafeAreaView className="bg-zinc-150 h-full w-full flex px-4">
      <View className="flex w-full h-16 mt-1 flex-row justify-between items-center px-2 overflow-hidden">
        <Text className="text-2xl font-rregular text-black flex flex-row justify-center w-[70%] items-center capitalize">
          {category}
        </Text>
        <View className="flex flex-row justify-center items-center w-14 h-14">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CategorySearchScreen;

const styles = StyleSheet.create({});
