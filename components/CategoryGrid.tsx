import React from "react";
import {
  View,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { styled } from "nativewind";
import { images } from "@/constants";
import { router, usePathname } from "expo-router";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 48) / 2;

interface Item {
  id: string;
  title: string;
}

interface FlatListGridProps {
  data: Item[];
  onPressItem?: (item: Item) => void;
  onEndReachedThreshold?: number;
  onEndReached?: () => void;
}

const StyledView = styled(View);

const CategoryGrid: React.FC<FlatListGridProps> = ({
  data,
  onPressItem,
  onEndReachedThreshold,
  onEndReached,
}) => {
  const pathname = usePathname();
  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      onPress={() => {
        // if (pathname.startsWith("/search/category")) {
        //   router.setParams({ category: item.title });
        // } else {
        router.push(`/search/category/${item.title}`);
        // }
      }}
      style={{
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        margin: 8, // Add margin for spacing between items
      }}
      className="bg-primary-200 rounded-xl flex flex-col"
      activeOpacity={0.7}
    >
      <View className="w-full bg-white h-[70%] rounded-t-xl">
        <Image
          source={{ uri: item.photoUrl }}
          resizeMode="cover"
          className="flex h-full w-full rounded-t-xl"
        />
      </View>
      <View className="w-full bg-primary h-[30%] rounded-b-xl flex justify-center items-center">
        <Text className=" text-white font-iregular text-base leading-5 text-center flex-wrap shrink px-2 capitalize">
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{
        // Center rows within the FlatList
        marginHorizontal: "auto",
      }}
      className="mt-2 mx-0" // Adjust border style as needed
      onEndReachedThreshold={onEndReachedThreshold || 0.5}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CategoryGrid;
