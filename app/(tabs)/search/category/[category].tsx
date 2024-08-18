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
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DataList from "@/data/productData";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { icons, images } from "@/constants";
import CartWishlistIcons from "@/components/CartWishListIcons";
import { CartContext, WishlistContext } from "@/context/CartWishListContext";
import ProductCard from "@/components/ProductCard";
interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  lowerPrice: number;
  upperPrice: number;
}
const CategorySearchScreen = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [isCovering, setIsCovering] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<Product[]>([]);

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

  useEffect(() => {
    fetchData();
  }, []);

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
          <Text className="text-2xl font-rregular text-black flex flex-row justify-center w-[60%] items-center capitalize">
            {category}
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
          {category}
        </Text>
        <CartWishlistIcons />
      </View>
      {/* <View className="flex flex-col w-full h-[38vh] rounded-xl border-x-4 border-y-4 border-secondary mt-5 overflow-hidden"> */}

      <FlatList
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
        ListHeaderComponent={() => (
          <TouchableOpacity onPress={toggleCovering}>
            <View className="flex flex-col w-full h-[38vh] rounded-xl border-x-4 border-y-4 border-secondary mt-5 overflow-hidden">
              <Image
                className="flex-1 w-full h-full"
                resizeMode="cover"
                source={{
                  uri: "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
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
