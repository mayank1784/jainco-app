import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DataList from "@/data/productData";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { icons, images } from "@/constants";
import CartWishlistIcons from "@/components/CartWishListIcons";
import { CartContext, WishlistContext } from "@/context/CartWishListContext";
import ProductCard from "@/components/ProductCard";
import { fetchProductsByCategory } from "@/services/firebaseFunctions";
import { ProductSmall } from "@/lib/types";
import { useCategory } from "@/context/CategoryContex";

const CategorySearchScreen = () => {
  const {category} = useCategory()
  // const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  
  const [isCovering, setIsCovering] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<ProductSmall[]>([]);


  const { cart, addToCart, removeFromCart, clearCart } = useContext(
    CartContext
  ) || {
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
  };

  const { wishlist, addToWishlist, removeFromWishlist, clearWishList } =
    useContext(WishlistContext) || {
      wishlist: [],
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      clearWishList: () => {},
    };

  const toggleCovering = () => {
    setIsCovering((prev) => !prev);
    Animated.timing(slideAnim, {
      toValue: isCovering ? 0 : 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      // Animation complete, pause for 2 seconds
      setTimeout(() => {
        setIsCovering(!isCovering);
      }, 2000);
    });
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "40%"], // Adjust as needed
  });
  useFocusEffect(
    React.useCallback(() => {
      const animationTimeout = setTimeout(() => {
        setIsCovering(true);
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start(() => {
          // Animation complete, pause for 2 seconds
          setTimeout(() => {
            setIsCovering(false);
          }, 2000);
        });
      }, 1000);

      return () => clearTimeout(animationTimeout);
    }, [])
  );

  useEffect(() => {
    return () => {
      // Clean up animation on unmount
      slideAnim.setValue(0);
    };
  }, []);

  // For fetching List Data and loading animation
 // Fetch product data
 const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const products = await fetchProductsByCategory(category.id || "");
    setData(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
}, [category.id]);


   // Refresh the product list
   const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const refreshedProducts = await fetchProductsByCategory(category.id || "");
   
      setData(refreshedProducts);
    } catch (error) {
      console.error("Error refreshing products:", error);
    } finally {
      setRefreshing(false);
    }
  }, [category.id]);

  useEffect(() => {
    if (category.id) {
      fetchData();
    }
  }, [category.id, fetchData]);

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
          <Text className="text-2xl font-rregular text-black flex flex-row justify-center w-[60%] items-center capitalize">
            {category.name}
          </Text>
          <CartWishlistIcons />
        </View>
        <View className="h-full w-full justify-start items-center mt-3">
          <ActivityIndicator size="large" color="#dcb64a" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-zinc-150 h-full w-full flex px-2">
      <View className="flex w-full h-auto mt-1 flex-row justify-between items-center overflow-hidden pb-2">
        <View className="flex flex-row justify-center items-center w-14 h-14">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <Text className="text-2xl font-rregular text-black flex flex-row justify-center w-[60%] items-center capitalize">
          {category.name}
        </Text>
        <CartWishlistIcons />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard item={item} category={category.name} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#dcb64a"]}
          />
        }
        ListHeaderComponent={() => (
          <>
            <TouchableOpacity onPress={toggleCovering}>
              <View className="flex flex-col w-full h-[38vh] rounded-xl border-x-4 border-y-4 border-secondary mt-5 overflow-hidden">
                <Image
                className="flex-1 w-full h-full z-99999"
                resizeMode="cover"
                source={{
                uri: category.image
                }}
              />

                <Animated.View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: slideInterpolation,
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                />
              </View>
            </TouchableOpacity>
          </>
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

export default CategorySearchScreen;

const styles = StyleSheet.create({});
