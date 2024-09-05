import { useState, useRef, useEffect, useCallback } from "react";
import {
  Image,
  Text,
  View,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import CategoryGrid from "@/components/CategoryGrid";

import { fetchCategories } from "@/services/firebaseFunctions";
import { Category } from "@/lib/types";
import { loadCategoriesFromCache, saveCategoriesToCache } from "@/lib/cacheUtils";


export default function Index() {
  const [isEndOfListReached, setIsEndOfListReached] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let cachedCategories = await loadCategoriesFromCache();
   
      if (cachedCategories.length > 0) {
        setCategories(cachedCategories);
      }else{
      const data = await fetchCategories();
      await saveCategoriesToCache(data)
      setCategories(data);}
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    setIsEndOfListReached(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY < prevScrollPos) {
      setIsEndOfListReached(false);
    }
    setPrevScrollPos(offsetY);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const categories = await fetchCategories()
      await saveCategoriesToCache(categories)
      setCategories(categories)
    } catch (error) {
      console.error("Error refreshing categories:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full items-center justify-center">
      {/* <ScrollView className="px-4"> */}
      <View className="w-full h-[60px] flex flex-row justify-center gap-3 items-center mt-5 px-2">
        {/* <Image source={images.logo} resizeMode="contain" className="w-6 h-6" /> */}
        <View className="w-1/5 h-full items-center justify-center overflow-hidden">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View className="flex flex-col justify-center items-center overflow-hidden">
          <Text className="text-black font-lbold text-[28px]">
            JAINCO DECOR
          </Text>
          <Text className="text-[16px] text-black font-rregular mt-0 pt-0 ">
            Decor your Dream Home
          </Text>
        </View>
        {/* <CartWishlistIcons /> */}
      </View>
      <View className="mt-4 px-4 flex flex-col">
        <SearchInput />
        <Text className="mt-4 text-xl font-iregular text-primary text-center">
          Our Products
        </Text>
        <View className="border border-primary-100 border-dashed mt-3 mx-2"></View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#dcb64a" className="mt-8" />
      ) : (
        <CategoryGrid
          data={categories}
          onEndReachedThreshold={0.1}
          onEndReached={handleEndReached}
          onRefresh={handleRefresh}
          
          refreshing={refreshing}
        />
      )}
      {/* {isEndOfListReached && (
        <View className="mt-4 bg-secondary w-full h-10">
          <Text className="text-lg text-center text-primary"> aaloo</Text>
        </View>
      )} */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
