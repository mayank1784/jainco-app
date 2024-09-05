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
import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { icons, images } from "@/constants";
import CartWishlistIcons from "@/components/CartWishListIcons";
import ProductCard from "@/components/ProductCard";
import { fetchProductsByCategory } from "@/services/firebaseFunctions";
import { useCategory } from "@/context/CategoryContex";
import { loadProductsFromCache, saveProductsToCache } from "@/lib/cacheUtils";
import { ProductSmall } from "@/lib/types";
import { CartContext } from "@/context/CartWishListContext";

const AnimatedImageHeader: React.FC<{ imageUri: string; description:string }> = ({ imageUri, description }) => {
  const [isCovering, setIsCovering] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleCovering = () => {
    setIsCovering((prev) => !prev);
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isCovering ? 0 : 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: isCovering ? 0 : 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "45%"], // Adjust as needed
  });


  useFocusEffect(
    React.useCallback(() => {
     
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();
      // No automatic slide back
      return () => {
        slideAnim.setValue(1); // Ensure the animation stays in the "covered" state on unmount
        opacityAnim.setValue(1);
      };
    }, [])
  );

  return (
    <TouchableOpacity onPress={toggleCovering} activeOpacity={1}>
      <View className="flex flex-col w-full h-[38vh] rounded-xl border-x-4 border-y-4 border-secondary mt-5 overflow-hidden">
        <Image
          className="flex-1 w-full h-full z-99999"
          resizeMode="cover"
          source={{
            uri: imageUri,
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
            justifyContent: "center",
            alignItems: "center",
            // paddingHorizontal: 10,
          }} 
        >
          <Animated.Text
            style={{
              color: "white",
              textAlign: "center",
              opacity: opacityAnim, // Fade in/out the text
              position: "absolute", // Keep the text centered
            }}
            className="text-iregular text-lg capitalize"
          >
           {description}
          </Animated.Text>
          
          
          </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const CategorySearchScreen = () => {
  const { category } = useCategory();
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
  



  const fetchData = useCallback(async () => {
        setLoading(true);
        try {
          let cachedProducts = await loadProductsFromCache(category.id || "");
          if (cachedProducts.length > 0) {
            setData(cachedProducts);
          } else {
            const products = await fetchProductsByCategory(category.id || "");
            await saveProductsToCache(products, category.id || "");
            setData(products);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }, [category.id]);
    
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const refreshedProducts = await fetchProductsByCategory(category.id || "");
      await saveProductsToCache(refreshedProducts, category.id || "");
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
  }, [category.id]);

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
          <AnimatedImageHeader imageUri={category.image} description={category.description} />
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
