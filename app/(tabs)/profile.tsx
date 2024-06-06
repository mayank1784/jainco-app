import { icons } from "@/constants";
import React from "react";
import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/lib/types";

interface ProfileProps {
  product: Product;
}

const Profile:React.FC<ProfileProps> = ({product}) => {
  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full">
      <ScrollView>
        {/* <View className="p-4"> */}
        {/* Product Image */}
        <View className="items-center p-4">
          <Image
            source={{
              // uri: "https://m.media-amazon.com/images/I/91rYqPyDBfL._AC_UF1000,1000_QL80_.jpg",
            uri: `${product.mainImage}`
            }} // Replace with your image URL
            className="w-full h-96"
            resizeMode="cover"
          />
        </View>

        {/* Rating and Reviews */}
        <View className="flex-row items-center mt-4 px-4">
          <Text className="text-yellow-500 mr-2">★★★★★</Text>
          <Text className="text-gray-500">8 reviews</Text>
        </View>

        {/* Product Name */}
        <Text className="text-lg font-bold mt-2 px-4">
          Astylish Women Open Front Long Sleeve Chunky Knit Cardigan
        </Text>

        {/* Price */}
        <Text className="text-2xl font-bold text-gray-800 mt-2 px-4">
          $89.99
        </Text>

        {/* Stock Status */}
        <Text className="text-green-500 mt-1 px-4">In Stock</Text>

        {/* Colors */}
        <View className="mt-4">
          <Text className="text-gray-600 px-4">Colors</Text>
          <ScrollView horizontal className="mt-2 px-4">
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
            />

            {/* Add more colors as needed */}
          </ScrollView>
        </View>

        {/* Sizes */}
        <View className="mt-4 px-4">
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
                className="border border-gray-300 rounded-md px-4 py-2 mr-2 mb-2"
              >
                <Text>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add to Cart Button */}
        <View className="flex-row flex-wrap mt-2 items-center gap-x-4 px-4">
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
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;