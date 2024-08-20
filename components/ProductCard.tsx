import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { icons } from "@/constants";
import { router } from "expo-router";
import { ProductSmall } from "@/lib/types";

interface ProductCardProps {
  item: ProductSmall;
  category?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, category }) => {
  return (
    <View className="p-4 bg-white rounded-lg shadow-md mt-2">
      <View className="flex-row justify-between">
        <View className="flex flex-col justify-between items-center overflow-hidden w-[30%] h-[100%]">
          <Image
            source={{
              uri: item.mainImage,
            }}
            className="flex-1 w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold capitalize">{item.name}</Text>
          {category && <Text className="text-sm text-primary-200 capitalize">
            {category}
          </Text>}
          
          <Text className="text-sm text-primary-200">{item.description}</Text>
          <Text className="text-lg font-lbold text-red-500 mt-2">
            ₹{item.lowerPrice} - ₹{item.upperPrice}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              router.push(`/search/product/${item.id}`);
            }}
          >
            <Image
              source={icons.arrowRight}
              className="w-7 h-7"
              resizeMode="contain"
              style={{ tintColor: "black" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default ProductCard;
