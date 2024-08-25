import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { icons } from "@/constants";
import { router } from "expo-router";
import { ProductSmall } from "@/lib/types";
import { htmlToText } from "html-to-text";

interface ProductCardProps {
  item: ProductSmall;
  category?: string;
  searchTerm?: string;
}

const highlightText = (text: string, searchTerm: string | null | undefined) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <Text key={index} className="bg-secondary text-black">
        {part}
      </Text>
    ) : (
      part
    )
  );
};
const ProductCard: React.FC<ProductCardProps> = ({
  item,
  category,
  searchTerm,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const plainTextDescription = htmlToText(item.description, {
    wordwrap: false, // Disable word wrapping
  });

  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);

  return (
    <View className="p-4 bg-white rounded-lg shadow-lg mt-2">
      <View className="flex-row justify-between items-center">
        {/* Image Section */}
        <TouchableOpacity
          onPress={() => {
            router.push(`/search/product/${item.id}`);
          }}
        >
          <View className="w-28 h-28 justify-center overflow-hidden rounded-lg bg-gray-100 border border-secondary">
            <Image
              source={{ uri: item.mainImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        {/* Details Section */}
        <View className="flex-1 ml-4">
          <TouchableOpacity
            onPress={() => {
              router.push(`/search/product/${item.id}`);
            }}
          >
            <Text className="text-lg font-bold capitalize">
              {highlightText(item.name, searchTerm)}
            </Text>
            {category && (
              <Text className="text-sm capitalize font-iregular text-secondary">
                {category}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDescription} activeOpacity={0.7}>
            <Text className="text-xs text-gray-700 mt-1 font-rregular">
              {isDescriptionExpanded
                ? highlightText(plainTextDescription, searchTerm)
                : `${plainTextDescription.slice(0, 30)}...`}
            </Text>
            {!isDescriptionExpanded && (
              <Text className="text-xs text-blue-500 mt-1">Read More</Text>
            )}
          </TouchableOpacity>
          <Text className="text-lg font-lbold text-red-500 mt-2">
            ₹{item.lowerPrice} - ₹{item.upperPrice}
          </Text>
        </View>

        {/* Action Button */}
        <View className="flex items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              router.push(`/search/product/${item.id}`);
            }}
            className="p-2 bg-gray-200 rounded-full"
          >
            <Image
              source={icons.arrowRight}
              className="w-6 h-6"
              resizeMode="contain"
              style={{ tintColor: "black" }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {item?.variationTypes && (
        <Text className="text-sm mt-2 font-rregular capitalize text-center">
          {highlightText(item.variationTypes, searchTerm)}
        </Text>
      )}
    </View>
  );
};

export default ProductCard;
