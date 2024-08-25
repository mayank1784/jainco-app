import {
  Image,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";

interface ItemShortCardProps {
  imageUrl: string;
  productName: string;
  categoryName: string;
  description: string;
  price: string;
}

const ItemShortCard: React.FC<ItemShortCardProps> = ({
  imageUrl,
  productName,
  categoryName,
  description,
  price,
}) => {
  return (
    <View className="p-4 bg-white rounded-lg shadow-md mb-4 mt-3">
      <View className="flex-row justify-between">
        <View className="flex flex-col justify-between items-center overflow-hidden w-[30%] h-[100%]">
          <Image
            source={{
              uri: require(`${imageUrl}`),
            }}
            className="flex-1 w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold capitalize">{productName}</Text>
          <Text className="text-sm text-gray-500 capitalize">
            {categoryName}
          </Text>
          <Text className="text-sm text-gray-500">{description}</Text>
          <Text className="text-xl font-bold text-red-500 mt-2">{price}</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Image
              source={icons.wishlist}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-4 border">
        <View className="flex-row justify-around items-center gap-3">
          <TouchableOpacity className="flex-row justify-between w-7 h-7">
            <Image
              source={icons.remove}
              className="w-full h-full"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-lg">99</Text>
          <TouchableOpacity className="flex-row justify-between w-7 h-7">
            <Image
              source={icons.add}
              className="w-full h-full"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="p-2 border rounded-lg border-gray-300 ml-4">
          <Text className="text-lg">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ItemShortCard;
