import { icons } from "@/constants";
import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/lib/types";

interface ProductPageProps {
  product: Product;
}

import data from "@/data/productItems";
const product = data[0];

// const Profile:React.FC<ProductPageProps> = ({product}) => {
const ProductPage: React.FC = () => {
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string | [string, string];
  }>({});
  const [mainImage, setMainImage] = useState(product.mainImage);
  const [productName, setProductName] = useState<string | null>(product.name);

  useEffect(() => {
    updateProductName();
  }, [selectedAttributes]);

  const updateProductName = () => {
    let updatedProductName = product.name;
    const selectedValues = Object.values(selectedAttributes).map((value) => {
      if (Array.isArray(value) && value.length === 2) {
        return value[0];
      }
      return value;
    });
    if (selectedValues.length > 0) {
      updatedProductName += " (" + selectedValues.join(", ") + ")";
    }
    setProductName(updatedProductName);
  };

  useEffect(() => {
    // Initialize the default selection
    const initialSelectedAttributes: {
      [key: string]: string | [string, string];
    } = {};
    let initialMainImage = product.mainImage;

    Object.keys(product.variations).forEach((attributeName) => {
      const firstValue = product.variations[attributeName][0];
      initialSelectedAttributes[attributeName] = firstValue;

      if (
        Array.isArray(firstValue) &&
        firstValue.length === 2 &&
        firstValue[1]
      ) {
        initialMainImage = firstValue[1];
      }
    });

    setSelectedAttributes(initialSelectedAttributes);
    setMainImage(initialMainImage);
    setProductName(product.name);
  }, [product]);

  const handleAttributeSelection = (
    attributeName: string,
    value: string | [string, string]
  ) => {
    setSelectedAttributes((prevSelectedAttributes) => {
      const newSelectedAttributes = {
        ...prevSelectedAttributes,
        [attributeName]: value,
      };

      // Determine the new main image based on the selected attributes
      const newMainImage = Object.values(newSelectedAttributes).reduce(
        (currentImage, selectedValue) => {
          if (
            Array.isArray(selectedValue) &&
            selectedValue.length === 2 &&
            selectedValue[1]
          ) {
            return selectedValue[1];
          }
          return currentImage;
        },
        product.mainImage
      );

      setMainImage(newMainImage as string);
      return newSelectedAttributes;
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full">
      <ScrollView>
        <View className="p-4">
          {/* Product Image */}
          <View className="items-center">
            <Image
              source={{
                uri: mainImage,
              }} // Replace with your image URL
              className="w-full h-96"
              resizeMode="cover"
            />
          </View>

          {/* Product Name */}
          <Text className="text-2xl font-lbold mt-4 capitalize">
            {productName}
          </Text>
          {/* Rating and Reviews */}
          <View className="flex-col items-start mt-2">
            <Text className="text-secondary font-rregular">
              {product.category}
            </Text>
            <Text className="text-primary-300 mt-1 capitalize font-iregular">
              {product.description}
            </Text>
          </View>

          {/* Price */}
          <Text className="text-2xl font-lbold text-primary mt-2">
            ₹{product.lowerPrice} - ₹{product.upperPrice}
          </Text>

          {/* Stock Status */}
          <Text className="text-green-500 mt-1 font-rregular">In Stock</Text>

          {/* Variations */}
          {Object.keys(product.variations).map((attributeName) => (
            <View key={attributeName} className="mt-4">
              <Text className="text-primary-300 capitalize font-iregular">
                {attributeName}
              </Text>
              <View className="flex-row flex-wrap mt-2">
                {product.variations[attributeName].map((value, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      handleAttributeSelection(attributeName, value)
                    }
                    className={`rounded-md py-2 mr-2 mb-2 px-4 ${
                      selectedAttributes[attributeName] === value
                        ? "bg-secondary text-black"
                        : "border border-primary-200"
                    }`}
                  >
                    <Text className="font-rregular">
                      {Array.isArray(value) ? value[0] : value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          {/* Colors */}
          {/* <View className="mt-4">
            <Text className="text-gray-600">Colors</Text>
            <ScrollView horizontal className="mt-2">
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Red_Color.jpg/1536px-Red_Color.jpg",
                }}
                className="w-12 h-12 mr-2 rounded-full"
              />
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Color-yellow.JPG",
                }}
                className="w-12 h-12 mr-2 rounded-full"
              />
              <Image
                source={{
                  uri: "https://imageonline.co/downloading.php?imagename=A20.png&color=green",
                }}
                className="w-12 h-12 mr-2 rounded-full"
              />
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Red_Color.jpg/1536px-Red_Color.jpg",
                }}
                className="w-12 h-12 mr-2 rounded-full"
              />
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Red_Color.jpg/1536px-Red_Color.jpg",
                }}
                className="w-12 h-12 mr-2 rounded-full"
              /> */}

          {/* Add more colors as needed */}
          {/* </ScrollView>
          </View> */}

          {/* Sizes */}
          {/* <View className="mt-4">
            <Text className="text-gray-600">Sizes</Text>
            <View className="flex-row flex-wrap mt-2">
              {[
                "XXS",
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "aas",
                "adf",
                "dwfwf",
                "dww",
                "wfegge",
              ].map((size) => (
                <TouchableOpacity
                  key={size}
                  className="border border-gray-300 rounded-md py-2 mr-2 mb-2 px-4"
                >
                  <Text>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View> */}

          {/* Add to Cart Button */}
          <View className="flex-row flex-wrap mt-2 items-center gap-x-4">
            <TouchableOpacity className="h-6 w-6 rounded-full">
              <Image
                source={icons.remove}
                className="w-full h-full"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity className="bg-secondary rounded-full py-4 mt-6 w-[60%]">
              <Text className="text-center text-white text-lg font-bold">
                Add to Cart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="h-6 w-6 rounded-full">
              <Image
                source={icons.add}
                className="w-full h-full"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductPage;
