import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { icons } from "@/constants";

const ProductCard: React.FC<any> = ({ item }) => {
  return (
    <View className="p-4 bg-white rounded-lg shadow-md mt-2">
      <View className="flex-row justify-between">
        <View className="flex flex-col justify-between items-center overflow-hidden w-[30%] h-[100%]">
          <Image
            source={{
              uri: "https://m.media-amazon.com/images/I/61mu9BUbGkL._AC_UF894,1000_QL80_.jpg",
            }}
            className="flex-1 w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold capitalize">{item.title}</Text>
          <Text className="text-sm text-primary-200 capitalize">
            {item.category}
          </Text>
          <Text className="text-sm text-primary-200">{item.description}</Text>
          <Text className="text-lg font-lbold text-red-500 mt-2">
            ₹{item.lowerPrice} - ₹{item.upperPrice}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity activeOpacity={0.5}>
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
