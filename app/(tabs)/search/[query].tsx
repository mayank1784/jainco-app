import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CartWishlistIcons from "@/components/CartWishListIcons";
import { images, icons } from "@/constants";
import SearchInput from "../../../components/SearchInput";
import DataList from "@/data/productData";
import ProductCard from "@/components/ProductCard";

import { useLocalSearchParams } from "expo-router";

interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  lowerPrice: number;
  upperPrice: number;
}

const SearchScreen = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(DataList); // Assign the fetched data
      setLoading(false);
    }, 2000); // Simulate a 2-second fetch time
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(DataList); // Assign the refreshed data
      setRefreshing(false);
    }, 2000); // Simulate a 2-second fetch time for refresh
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-zinc-150 h-full w-full flex px-2">
        <View className="flex w-full h-auto mt-1 flex-row justify-between items-center overflow-hidden">
          <View className="flex flex-row justify-center items-center w-14 h-14">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-full h-full"
            />
          </View>
          <View className="w-[65%]">
            <SearchInput />
          </View>
          <CartWishlistIcons />
        </View>
        <View className="mt-2 w-full h-auto">
          <Text className="text-primary-200 text-xs font-rregular mb-2">
            Search Results for {query}
          </Text>
        </View>
        <View className="h-full w-full justify-start items-center">
          <ActivityIndicator size="large" color="#dcb64a" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-zinc-150 h-full w-full flex px-2">
      <View className="flex w-full h-auto mt-1 flex-row justify-between items-center overflow-hidden">
        <View className="flex flex-row justify-center items-center w-14 h-14">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View className="w-[65%]">
          <SearchInput />
        </View>
        <CartWishlistIcons />
      </View>
      <View className="mt-2 w-full h-auto">
        <Text className="text-primary-200 text-xs font-rregular mb-2">
          Search Results for {query}
        </Text>
      </View>
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#dcb64a"]}
          />
        }
      /> */}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
