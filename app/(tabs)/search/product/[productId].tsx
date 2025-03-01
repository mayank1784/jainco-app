import { icons, images as constImages } from "@/constants";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useMemo } from "react";

import HTMLView from "react-native-htmlview";
import { useWindowDimensions } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
// import { ImageZoom } from '@likashefqet/react-native-image-zoom';
// import ImageZoom from "@/lib/imageZoom";
import ZoomableImage from "@/components/ZoomableImage"
import SearchInput from "@/components/SearchInput";
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
  Modal,
  BackHandler,
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

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");
// Define thresholds for different screen sizes (e.g., tablets)
const isTablet = viewportWidth >= 480; // You can adjust this threshold based on your needs

// const saveDataToLocalServer = async (data: any) => {
//   try {
//     const response = await fetch("http://192.168.1.6:4389/save-data", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       console.log("Data saved successfully!");
//     } else {
//       console.error("Failed to save data");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

const ProductPage: React.FC = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [demoProduct, setDemoProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<Variation[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [variationTypesArray, setVariationTypesArray] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<VariationType>(
    {}
  ); //handling variation selection
  const [productName, setProductName] = useState<string | "">("");
  const [unavailableComb, setUnavailableComb] =
    useState<UnavailableCombinations>([]);
  const [images, setImages] = useState<string[]>([]);

  const [quantity, setQuantity] = useState<number>(10);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const { cart, addToCart, clearCart } = useContext(CartContext) || {
    cart: [],
    addToCart: () => {},
    clearCart: () => {},
  };

  // useEffect(() => {
  //   const save = async (data: any) => {
  //     await saveDataToLocalServer(data);
  //   };
  //   if (unavailableComb.length > 0) {
  //     save(unavailableComb);
  //   }
  // }, [unavailableComb]);

  // useEffect(() => {
  //   const save = async (data: any) => {
  //     await saveDataToLocalServer(data);
  //   };
  //   if (variations && variations.length > 0) {
  //     save(variations);
  //   }
  // }, [variations]);

  useEffect(() => {
    let unsubscribeProduct: (() => void) | undefined;
    let unsubscribeVariations: (() => void) | undefined;

    const fetchData = async () => {
      try {
        unsubscribeProduct = fetchProductSnapshot(
          { id: productId ?? "" },
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
          productId ?? "",
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
    }
  }, [demoProduct]);

  useEffect(() => {
    if (demoProduct && demoProduct.variationTypes) {
      setVariationTypesArray(() => {
        return Object.keys(demoProduct.variationTypes ?? {});
      });
    }
  }, [demoProduct, demoProduct?.variationTypes]);

  useEffect(() => {
    if (demoProduct && variations) {
      const unava = findUnavailableCombinations(
        demoProduct.variationTypes ?? {},
        variations
      );
      setUnavailableComb(unava);
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

    // Start with the default product images
    let updatedImages = [
      demoProduct?.mainImage,
      ...(demoProduct?.otherImages || []),
    ];

    // Update the price state based on the selected variation
    if (selectedVariation) {
      setPrice(selectedVariation.price);
      if (selectedVariation.images && selectedVariation.images.length > 0) {
        updatedImages = [...(selectedVariation.images || []), ...updatedImages];
      }

      setImages(updatedImages.filter(Boolean) as string[]);
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
      // const cartItem = {
      //   qty: quantity,
      //   productName: productName,
      //   productId: demoProduct.id,
      //   price: demoProduct.lowerPrice,
      //   productMainImage: demoProduct.mainImage,
      //   amount: quantity * demoProduct.lowerPrice,
      // };
      // addToCart(cartItem);
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
      amount: quantity * selectedVariation.price,
    };

    addToCart(cartItem);
    return;
  };

  const getFirstValidCombination = (
    initialSelection: VariationType,
    fixedAttributes: { [key: string]: string }
  ): VariationType => {
    // Merge initialSelection with fixedAttributes, fixedAttributes take precedence
    let currentSelection = { ...initialSelection, ...fixedAttributes };

    const attributes = Object.keys(demoProduct?.variationTypes ?? {});
    const attributeValues: { [key: string]: string[] } = attributes.reduce(
      (acc, attrName) => {
        acc[attrName] = demoProduct?.variationTypes?.[attrName] ?? [];
        return acc;
      },
      {} as { [key: string]: string[] }
    );

    const generateCombinations = (
      currentSelection: VariationType,
      attributesLeft: string[]
    ): VariationType[] => {
      if (attributesLeft.length === 0) {
        return [currentSelection];
      }

      const attributeName = attributesLeft[0];
      const values = attributeValues[attributeName];
      const combinations = [];

      for (const value of values) {
        const newSelection = { ...currentSelection, [attributeName]: value };
        combinations.push(
          ...generateCombinations(newSelection, attributesLeft.slice(1))
        );
      }

      return combinations;
    };

    // Identify attributes that are not fixed
    const nonFixedAttributes = attributes.filter(
      (attrName) => !(attrName in fixedAttributes)
    );

    // Generate combinations by varying the non-fixed attributes
    const allCombinations = generateCombinations(
      currentSelection,
      nonFixedAttributes
    );

    // Find the first valid combination that is not unavailable
    for (const combination of allCombinations) {
      if (!isCombinationUnavailable(combination, unavailableComb)) {
        return combination;
      }
    }

    // Return the initial selection with fixed attributes if no valid combination is found
    return initialSelection;
  };

  const firstAttributeHandleAttributeSelection = (
    attributeName: string,
    value: string
  ) => {
    const newSelection = { ...selectedAttributes, [attributeName]: value };
    const obj = { [attributeName]: value };
    const validCombination = getFirstValidCombination(newSelection, obj);
    // const validCombination = getFirstValidCombination(newSelection,attributeName, value);
    // console.log(JSON.stringify(validCombination, null, 2));

    setSelectedAttributes(validCombination || newSelection);
  };

  //logic from second attribute to last attribute selction such that upper attribute is selectable and change only its
  // lower attributes for availability

  //Function
  //@@@ Write here
  const betweenAttributeHandleAttributeSelection = (
    attributeName: string,
    value: string,
    currentIndex: number
  ) => {
    const newSelection = { ...selectedAttributes, [attributeName]: value };

    if (
      Object.keys(selectedAttributes).length ===
      Object.keys(demoProduct?.variationTypes ?? {}).length
    ) {
      const fixedAttributes: { [key: string]: string } = {};
      const upperAttributes = variationTypesArray.slice(0, currentIndex + 1);

      upperAttributes.forEach((attr) => {
        if (newSelection[attr]) {
          fixedAttributes[attr] = newSelection[attr];
        }
      });
      fixedAttributes[attributeName] = value;

      const validCombination = getFirstValidCombination(
        selectedAttributes,
        fixedAttributes
      );

      setSelectedAttributes(validCombination);
    } else {
      firstAttributeHandleAttributeSelection(attributeName, value);
    }
  };

  const noOfUnavaiCombForAttrValue = useCallback(
    (attributes: Record<string, string>) => {
      return unavailableComb.filter((combination) => {
        return Object.entries(attributes).every(([attrName, attrValue]) => {
          return combination.combination[attrName] === attrValue;
        });
      }).length;
    },
    [unavailableComb]
  );

  const getNoOfTotalPossibleCombForAttrValue = useMemo(() => {
    return (attributeNames: string[]) => {
      if (!demoProduct?.variationTypes) return 0;

      const attributeCounts = Object.entries(demoProduct.variationTypes)
        .filter(([key]) => !attributeNames.includes(key)) // Exclude the specified attributes
        .map(([, values]) => values.length); // Get the length of each attribute's values

      return attributeCounts.reduce((acc, count) => acc * count, 1); // Calculate the total combinations
    };
  }, [demoProduct?.variationTypes]);

  const areAllCombinationsUnavailable = useCallback(
    (attributes: Record<string, string>) => {
      const a = getNoOfTotalPossibleCombForAttrValue(Object.keys(attributes));
      const b = noOfUnavaiCombForAttrValue(attributes);
      return a === b;
    },
    [unavailableComb, demoProduct?.variationTypes]
  );

  const { width } = useWindowDimensions();

  const openModal = () => {
    setActiveSlide(0);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const imagesWithObjects = images.map(url => ({ url }));
  // Handle back button press to close modal
  useEffect(() => {
    const backAction = () => {
      if (isModalVisible) {
        closeModal(); // Close the modal when back button is pressed
        return true; // Prevent default back action
      }
      return false; // Allow default back action if modal is not visible
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Clean up the event listener on component unmount
    return () => backHandler.remove();
  }, [isModalVisible]);
  

  const handleDisabledState = (
    attributeName: string,
    value: string,
    index: number
  ) => {
    const upperAttributes = variationTypesArray.slice(0, index + 1);
    const fixedAttributes: Record<string, string> = {};

    upperAttributes.forEach((attr) => {
      fixedAttributes[attr] = selectedAttributes[attr];
    });
    fixedAttributes[attributeName] = value;

    return areAllCombinationsUnavailable(fixedAttributes);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full">
      {loading ? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator size="large" color={"#dcb64a"} />
        </View>
      ) : demoProduct ? (
        <ScrollView>
          <View>
          <View className="flex w-full h-auto mt-1 flex-row justify-between items-center overflow-hidden pb-0 px-2">
        <View className="flex flex-row justify-center items-center w-14 h-14">
          <Image
            source={constImages.logo}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View className="flex-1 mx-2">
          <SearchInput />
        </View>
      </View>
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={openModal}>
                  <View
                    style={{
                      width: viewportWidth,
                      alignItems: "center",
                      padding: 16,
                    }}
                  >
                    <Image source={{ uri: item }} style={styles.image} />
                  </View>
                </TouchableOpacity>
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
           
            {/* ============================================================== */}
            {/* Modal for full screen image slider with zooming functionality */}
            <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View className="flex bg-primary bg-opacity-50 justify-center items-center h-full w-full">
          {/* Close button */}
          <TouchableOpacity onPress={closeModal} className="absolute top-8 right-8 z-10">
            <Text className="text-white text-xl bg-black p-4 rounded-xl">Close</Text>
          </TouchableOpacity>

           {/* Image Zoom component */}
          
           <View className="flex flex-col justify-center items-center">
           <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="" style={{width: viewportWidth, height: viewportWidth}}>
                
         
              <Image source={{uri:item}} 
              className="w-full h-full" resizeMode="cover"
              />
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
      </View>
        
          {/* Indicator for current image in modal */}
          <View className="flex-row justify-center mt-2 mb-4">
            {images.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === activeSlide ? "bg-secondary" : "bg-primary-200"
                }`}
              />
            ))}
          </View>
        </View>
      </Modal>
            {/* ============================================================================================================= */}
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
                  (attributeName, idx, array) => (
                    <View key={attributeName} className="mt-4">
                      <Text  className="text-primary-400 capitalize font-iregular">
                        {attributeName}
                      </Text>
                      <View className="flex-row flex-wrap mt-2">
                        {demoProduct.variationTypes?.[attributeName]?.length ? (
                          demoProduct.variationTypes[attributeName].map(
                            (value: string, index: number) => {
                              const isSelected =
                                selectedAttributes[attributeName] === value;

                              if (idx === array.length - 1) {
                                const isDisabled = isCombinationUnavailable(
                                  {
                                    ...selectedAttributes,
                                    [attributeName]: value,
                                  },
                                  unavailableComb
                                );

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
                                // }
                              }

                              if (idx === 0) {
                                const isDisabled =
                                  areAllCombinationsUnavailable({
                                    [attributeName]: value,
                                  });

                                return (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                      !isDisabled &&
                                      firstAttributeHandleAttributeSelection(
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
                              const isDisabled = handleDisabledState(
                                attributeName,
                                value,
                                idx
                              );
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() =>
                                    !isDisabled &&
                                    betweenAttributeHandleAttributeSelection(
                                      attributeName,
                                      value,
                                      idx
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
            <View className="flex-row mt-2 items-center gap-x-2 justify-start">
              <TouchableOpacity
                className="bg-primary rounded-md w-1/5 p-2"
                onPress={() => {
                  clearCart();
                }}
              >
                <Text className="text-white">clear cart</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-secondary rounded-md text-white p-2">
                <Link href={"/(tabs)/cart"}>Go to Cart</Link>
              </TouchableOpacity>
            </View>
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
    width:viewportWidth,
    height: isTablet ? viewportWidth*0.85 : 330,
    resizeMode: "stretch",
    borderRadius: 0,
  },
  htmlContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
});
export default ProductPage;
