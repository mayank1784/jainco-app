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
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import ProductCard from "@/components/ProductCard";

import { useLocalSearchParams } from "expo-router";
import { searchClient } from "@/services/algoliaClient";

const SearchScreen = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const indexName = "products";

      const results = await searchClient.searchSingleIndex({
        indexName,
        searchParams: {
          query: query,
          hitsPerPage: 20,
        },
      });

      const extractedData = results.hits.map((hit: any) => ({
        name: hit.name,
        id: hit.objectID,
        category: hit.category,
        lowerPrice: hit.lowerPrice,
        upperPrice: hit.upperPrice,
        description: hit.description,
        variationTypes: hit.variationTypes
          ? hit.variationTypes.join(", ")
          : null,
        mainImage: hit.mainImage,
      }));
      setData(extractedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.log(error);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-zinc-150 h-full w-full flex px-2">
        <View className="flex w-full h-auto mt-1 flex-row justify-between items-center overflow-hidden">
          <View className="flex justify-center items-center w-14 h-14 p-1">
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
        <View className="flex justify-center items-center w-14 h-14 p-1">
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
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            category={item.category}
            searchTerm={query}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#dcb64a"]}
          />
        }
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center w-full h-full">
            <Text className="text-center text-black font-iregular text-lg">
              No search results! Try again ...
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="w-full h-auto justify-start items-center mt-2 mb-2">
            <Text className="text-base text-primary-200 font-iregular">
              That's All
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
