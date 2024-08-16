import { icons } from "@/constants";
import React, { useState, useEffect, useContext, useMemo } from "react";
import HTMLView from 'react-native-htmlview';
import { useWindowDimensions } from "react-native";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  ViewToken,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Product,
  VariationType,
  UnavailableCombinations,
} from "@/lib/types";
import { CartContext } from "@/context/CartWishListContext";
import { fetchProductData } from "@/services/firebaseFunctions";
import { findUnavailableCombinations } from "@/lib/utilityFunctions";

const { width: viewportWidth } = Dimensions.get("window");

const ProductPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [demoProduct, setDemoProduct] = useState<Product | null>(null);
  const [error, setError] = useState<any>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<VariationType>(
    {}
  ); //handling variation selection
  const [productName, setProductName] = useState<string | "">("");
  const [unavailableComb, setUnavailableComb] =
    useState<UnavailableCombinations | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(10);

  const [activeSlide, setActiveSlide] = useState(0);
  const { cart, addToCart, clearCart } = useContext(CartContext) || {
    cart: [],
    addToCart: () => {},
    clearCart: () => {},
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); // Start loading
        const prodData = await fetchProductData({ id: "ry7FcIFpnOruth613BoE" });
        // const prodData = await fetchProductData({ id: "Dg9Gry82ATX2dif5Gbfv" });
        setDemoProduct(prodData); // Set fetched data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false); // Ensure loading is false even if an error occurs
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!demoProduct || !selectedAttributes) return;
  
    // Find the variation matching the selected attributes
    const selectedVariation = demoProduct.variations?.find((variation) => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        return variation.variationType[key] === value;
      });
    });
  
    // Update the price state based on the selected variation
    if (selectedVariation) {
      setPrice(selectedVariation.price);
    } else {
      setPrice(null); // No matching variation found
    }
  }, [selectedAttributes, demoProduct]);

  useEffect(() => {
    if (demoProduct) {
      const loadedImages = [
        demoProduct.mainImage,
        ...(demoProduct.otherImages || []),
      ];
      setImages(loadedImages);
      setMainImage(demoProduct.mainImage);
      setProductName(demoProduct.name);
    }
  }, [demoProduct]);
  useEffect(() => {
    if (images.length > 0 || mainImage || productName) {
      console.log("Images:", images);
      console.log("Main Image:", mainImage);
      console.log("Product Name:", productName);
    }
  }, [images, mainImage, productName]);

  useEffect(() => {
    if (unavailableComb && demoProduct) {
      console.log("prod: ", JSON.stringify(demoProduct, null, 2));
      console.log("unavai: ", JSON.stringify(unavailableComb, null, 2));
    }
  }, [unavailableComb, demoProduct]);

  const unavailableCombinations = useMemo(() => {
    if (
      demoProduct?.variationTypes &&
      demoProduct?.variations &&
      demoProduct.variations.length > 0
    ) {
      return findUnavailableCombinations(
        demoProduct.variationTypes,
        demoProduct.variations
      );
    }
    return [];
  }, [demoProduct]);

  useEffect(() => {
    if (!demoProduct || demoProduct.variations?.length === 0) {
      // No variations to process, set loading to false
      setLoading(false);
    }

    if (unavailableCombinations.length > 0) {
      setUnavailableComb(unavailableCombinations);
      setLoading(false); // End loading once unavailable combinations are set
    }
  }, [unavailableCombinations, demoProduct]);

  useEffect(() => {
    updateProductName();
  }, [selectedAttributes, demoProduct]);

  const updateProductName = () => {
    if (!demoProduct) return;
    let updatedProductName = demoProduct.name;
    const selectedValues = Object.values(selectedAttributes).map((value) => {
      return value;
    });
    if (selectedValues.length > 0) {
      updatedProductName += " (" + selectedValues.join(", ") + ")";
    }
    setProductName(updatedProductName);
  };

  const isCombinationUnavailable = (
    selectedAttributes: VariationType
  ): boolean => {
    if (!unavailableComb || unavailableComb.length === 0) return false;

    // Convert selected attributes to an array of [key, value] pairs
    const selectedEntries = Object.entries(selectedAttributes);

    // Check if any combination in unavailableComb matches the selectedAttributes
    return unavailableComb.some((combination) => {
      return selectedEntries.every(([attribute, value]) => {
        // Check if the combination has this attribute with the same value
        return combination.combination[attribute] === value;
      });
    });
  };

  const handleAttributeSelection = (attributeName: string, value: string) => {
    setSelectedAttributes((prevSelected) => {
      const newSelected = { ...prevSelected, [attributeName]: value };

      if (!isCombinationUnavailable(newSelected)) {
        return newSelected;
      }
      return prevSelected; // If unavailable, keep previous selection
    });
  };

  useEffect(() => {
    if (!demoProduct || !demoProduct.variationTypes) return;
  
    const findFirstAvailableCombination = () => {
      const attributeNames = Object.keys(demoProduct.variationTypes ?? {});
      const selectedAttributes: VariationType = {};
  
      for (const attributeName of attributeNames) {
        const attributeValues = demoProduct.variationTypes?.[attributeName] ?? [];
  
        // Loop through each value of the current attribute
        for (const value of attributeValues) {
          // Create a test combination by adding the current value to selectedAttributes
          const testAttributes = {
            ...selectedAttributes,
            [attributeName]: value,
          };
  
          // Check if this combination is available
          if (!isCombinationUnavailable(testAttributes)) {
            selectedAttributes[attributeName] = value;
            break; // Break out of the loop once a valid value is found
          }
        }
  
        // If no valid value is found for this attribute, return null (invalid combination)
        if (!selectedAttributes[attributeName]) {
          return null;
        }
      }
  
      return selectedAttributes;
    };
  
    const firstAvailableCombination = findFirstAvailableCombination();
  
    if (firstAvailableCombination) {
      setSelectedAttributes(firstAvailableCombination);
    } else {
      console.log("No available combination found");
      setSelectedAttributes({});
    }
  }, [demoProduct]);

  const viewableItemChanges = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveSlide(viewableItems[0].index || 0);
    }
  };

  const handleAddToCart = (quantity: number) => {
    if (!demoProduct || !selectedAttributes) return;

    const selectedVariation = demoProduct.variations?.find((variation) => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        return variation.variationType[key] === value;
      });
    });

    // If no matching variation is found, return or show an error
    if (!selectedVariation) {
      const cartItem = {
        qty: quantity,
        productName: productName,
        productId: demoProduct.id,
        price: demoProduct.lowerPrice,
        productMainImage: demoProduct.mainImage,
      }
      addToCart(cartItem)
      return;
    }
    // Prepare the cart item details
    const cartItem = {
      sku: selectedVariation.sku,
      qty: quantity,
      productName: productName, // Assuming product has a 'name' field
      productId: demoProduct.id, // Assuming product has an 'id' field
      variationId: selectedVariation.id,
      price: selectedVariation.price,
      productMainImage: demoProduct.mainImage, // Assuming product has a 'mainImage' field
      variationImage: selectedVariation.images?.[0] || demoProduct.mainImage, // Fallback to product main image if no variation image is available
    };

    addToCart(cartItem);
    return
  };

  const { width } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full">
      {loading ? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator size="large" color={"#dcb64a"} />
        </View>
      ) : demoProduct ? (
        <ScrollView>
          <View>
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: viewportWidth,
                    alignItems: "center",
                    padding: 16,
                  }}
                >
                  <Image source={{ uri: item }} style={styles.image} />
                </View>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={viewableItemChanges}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 90,
              }}
            />
            <View className="flex-row justify-center mt-1">
              {images.map((_, index) => (
                <View
                  key={index}
                  className={` h-2 w-2 rounded-full mx-1 ${
                    index === activeSlide ? "bg-secondary" : "bg-primary-200"
                  }`}
                />
              ))}
            </View>
          </View>
          <View className="p-4">
            {/* Product Name */}
            <Text className="text-2xl font-lbold mt-0 capitalize">
              {productName}
            </Text>
            {/* Category and Description */}
            <View className="flex-col items-start mt-2">
              <Text className="text-secondary font-rregular capitalize">
                {demoProduct.category}
              </Text>

           
              <HTMLView value={demoProduct.description} 
              style={[styles.htmlContainer, { width: width * 0.9 }]} // Adjust width relative to screen size
              />
            </View>

            {/* Price */}
            <View className="flex flex-1 flex-row justify-start items-baseline gap-3">
            <Text className="text-2xl font-lbold text-primary mt-2">
            ₹{price !== null ? price : demoProduct.lowerPrice}
            </Text>
            <Text className="text-primary-200 mt-1 font-rregular">
              (₹{demoProduct.lowerPrice} - ₹{demoProduct.upperPrice})
              </Text>
              </View>

            {/* Stock Status */}
            <Text className="text-green-500 mt-1 font-rregular">In Stock</Text>

            {/* Variations */}
            {
              // Use optional chaining to safely access variationTypes and its properties
              Object.keys(demoProduct.variationTypes ?? {}).length > 0 ? (
                Object.keys(demoProduct.variationTypes ?? {}).map(
                  (attributeName) => (
                    <View key={attributeName} className="mt-4">
                      <Text className="text-primary-400 capitalize font-iregular">
                        {attributeName}
                      </Text>
                      <View className="flex-row flex-wrap mt-2">
                        {demoProduct.variationTypes?.[attributeName]?.length ? (
                          demoProduct.variationTypes[attributeName].map(
                            (value: string, index: number) => {
                              const isDisabled = isCombinationUnavailable({
                                ...selectedAttributes,
                                [attributeName]: value,
                              });
                              const isSelected =
                                selectedAttributes[attributeName] === value;
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() =>
                                    !isDisabled &&
                                    handleAttributeSelection(
                                      attributeName,
                                      value
                                    )
                                  }
                                  className={`rounded-md py-2 mr-2 mb-2 px-4 ${
                                    isSelected
                                      ? "bg-secondary text-black"
                                      : isDisabled
                                      ? "border-dotted border border-red-500"
                                      : "border border-primary-200"
                                  }`}
                                  disabled={isDisabled}
                                >
                                  <Text
                                    className={`font-rregular capitalize ${
                                      isDisabled && "text-primary-100"
                                    }`}
                                  >
                                    {value}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          )
                        ) : (
                          <Text>No variations available</Text> // Handle the case where there are no values
                        )}
                      </View>
                    </View>
                  )
                )
              ) : (
                <View>
                  <Text>No variation types available</Text>
                </View>
              )
            }

            {/* Add to Cart Button */}
            <View className="flex-row mt-2 items-center gap-x-2 justify-start">
              <View className="flex-row items-center justify-start">
                {/* qty add button */}
                <TouchableOpacity
                  className="h-8 w-8 rounded-full mr-2"
                  onPress={() => setQuantity((prevQty) => prevQty - 1)}
                >
                  <Image
                    source={icons.remove}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* qty input */}
                <TextInput
                  className="border border-gray-300 rounded-md px-4 py-2 text-center"
                  keyboardType="numeric"
                  value={quantity.toString()}
                  onChangeText={(text) => setQuantity(Number(text))}
                />

                {/* qty remove button */}
                <TouchableOpacity
                  className="h-8 w-8 rounded-full ml-2"
                  onPress={() => setQuantity((prevQty) => prevQty + 1)}
                >
                  <Image
                    source={icons.add}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="bg-secondary rounded-full py-4 flex-grow"
                onPress={() => {
                  handleAddToCart(quantity);
                }}
              >
                <Text className="text-center text-white text-lg font-bold">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-primary rounded-md w-1/5 p-2"
              onPress={() => {
                clearCart();
              }}
            >
              <Text className="text-white">clear cart</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : error ? (
        <View className="items-center justify-center flex-1 h-full w-full">
          <Text className="font-lbold">Error! Nothing Fetched</Text>
        </View>
      ) : (
        <View className="items-center justify-center flex-1 h-full w-full">
          <ActivityIndicator size="large" color={"#dcb64a"} />
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  image: {
    width: viewportWidth,
    height: 384,
    resizeMode: "cover",
    borderRadius: 0,
  },
  htmlContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
});
export default ProductPage;
