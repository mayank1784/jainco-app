import { icons } from "@/constants";
import React, { useState, useEffect, useContext, useCallback } from "react";
import HTMLView from "react-native-htmlview";
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
  Variation,
  UnavailableCombinations,
} from "@/lib/types";
import { CartContext } from "@/context/CartWishListContext";
import {
  fetchProductSnapshot,
  fetchVariationsSnapshot,
} from "@/services/firebaseFunctions";
import { findUnavailableCombinations } from "@/lib/utilityFunctions";

const { width: viewportWidth } = Dimensions.get("window");

const ProductPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [demoProduct, setDemoProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<Variation[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<VariationType>(
    {}
  ); //handling variation selection
  const [productName, setProductName] = useState<string | "">("");
  const [unavailableComb, setUnavailableComb] =
    useState<UnavailableCombinations>([]);
  const [images, setImages] = useState<string[]>([]);

  const [quantity, setQuantity] = useState<number>(10);

  const [activeSlide, setActiveSlide] = useState(0);
  const { cart, addToCart, clearCart } = useContext(CartContext) || {
    cart: [],
    addToCart: () => {},
    clearCart: () => {},
  };

  useEffect(() => {
    let unsubscribeProduct: (() => void) | undefined;
    let unsubscribeVariations: (() => void) | undefined;

    const fetchData = async () => {
      try {
        unsubscribeProduct = fetchProductSnapshot(
          { id: "e48nyI0Yjs5DPs0xsYAT" },
          (product: Product | null, error?: Error) => {
            if (error) {
              setError(error.message);
              setLoading(false);
            } else if (product) {
              setDemoProduct(product);
              setLoading(false);
            }
          }
        );

        unsubscribeVariations = fetchVariationsSnapshot(
          "e48nyI0Yjs5DPs0xsYAT",
          (variations: Variation[] | null, error?: Error) => {
            if (error) {
              setError(error.message);
            } else if (variations) {
              setVariations(variations);
            }
          }
        );
      } catch (err) {
        setError("Failed to fetch product data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (typeof unsubscribeProduct === "function") {
        unsubscribeProduct();
      }
      if (typeof unsubscribeVariations === "function") {
        unsubscribeVariations();
      }
    };
  }, []);

  useEffect(() => {
    if (demoProduct) {
      const loadedImages = [
        demoProduct.mainImage,
        ...(demoProduct.otherImages || []),
      ];
      setImages(loadedImages);
      setProductName(demoProduct.name);

      if (variations) {
        const unava = findUnavailableCombinations(
          demoProduct.variationTypes ?? {},
          variations
        );
        setUnavailableComb(unava);
      }
    }
  }, [demoProduct, variations]);

  useEffect(() => {
    if (!demoProduct) return;

    const updatedProductName =
      demoProduct.name +
      (Object.values(selectedAttributes).length > 0
        ? ` (${Object.values(selectedAttributes).join(", ")})`
        : "");

    setProductName(updatedProductName);
  }, [selectedAttributes, demoProduct]);


  useEffect(() => {
    if (!demoProduct || !demoProduct.variationTypes || !variations) return;
  
    const findFirstAvailableCombination = () => {
      const initialSelectedAttributes: VariationType = {};
      const attributeNames = Object.keys(demoProduct.variationTypes ?? []);
  
      // Recursive function to search for the first available combination
      const searchCombination = (
        index: number,
        selected: VariationType
      ): VariationType | null => {
        // Base case: all attributes have been selected
        if (index === attributeNames.length) {
          // Check if the selected combination is available
          return isCombinationUnavailable(selected, unavailableComb)
            ? null // Combination is unavailable, return null
            : selected; // Combination is available, return it
        }
  
        const attributeName = attributeNames[index];
  
        // Iterate over each value of the current attribute
        for (const value of demoProduct.variationTypes?.[attributeName] ?? []) {
          const testAttributes = { ...selected, [attributeName]: value };
  
          // Recursively search the next attribute level
          const result = searchCombination(index + 1, testAttributes);
  
          if (result) return result; // If a valid combination is found, return it
        }
  
        return null; // No valid combinations found at this level
      };
  
      return searchCombination(0, initialSelectedAttributes);
    };
  
    // Find and set the first available combination of attributes
    const firstAvailableCombination = findFirstAvailableCombination();
  
    if (firstAvailableCombination) {
      setSelectedAttributes(firstAvailableCombination);
    }
  }, [demoProduct, unavailableComb, variations]);
  

  useEffect(() => {
    if (!variations || !selectedAttributes) return;

    // Find the variation matching the selected attributes
    const selectedVariation = variations?.find((variation) => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        return variation.variationType[key] === value;
      });
    });

    // Update the price state based on the selected variation
    if (selectedVariation) {
      // console.log('selected variation: ',selectedVariation)
      setPrice(selectedVariation.price);
      if (selectedVariation.images && selectedVariation.images.length > 0) {
        setImages((prevImages) => [
          ...(selectedVariation.images || []),
          ...prevImages,
        ]);
      }
    } else {
      setPrice(null); // No matching variation found
    }
  }, [selectedAttributes, variations]);

  const isCombinationUnavailable = (
    selectedAttributes: VariationType,
    unavailableCombinations: UnavailableCombinations
  ): boolean => {
    if (!unavailableCombinations || unavailableCombinations.length === 0)
      return false;

    // Convert selected attributes to an array of [key, value] pairs
    const selectedEntries = Object.entries(selectedAttributes);

    // Check if any combination in unavailableComb matches the selectedAttributes
    return unavailableCombinations.some((combination) => {
      return selectedEntries.every(([attribute, value]) => {
        // Check if the combination has this attribute with the same value
        return combination.combination[attribute] === value;
      });
    });
  };

  const handleAttributeSelection = (attributeName: string, value: string) => {
    setSelectedAttributes((prevSelected) => {
      const newSelected = { ...prevSelected, [attributeName]: value };

      if (!isCombinationUnavailable(newSelected, unavailableComb)) {
        return newSelected;
      }
      return prevSelected; // If unavailable, keep previous selection
    });
  };

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

    const selectedVariation = variations?.find((variation) => {
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
      };
      addToCart(cartItem);
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
    return;
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

              <HTMLView
                value={demoProduct.description}
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
                              const isDisabled = isCombinationUnavailable(
                                {
                                  ...selectedAttributes,
                                  [attributeName]: value,
                                },
                                unavailableComb
                              );
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
          <Text className="font-lbold">
            Error! Nothing Fetched {JSON.stringify(error)}
          </Text>
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
