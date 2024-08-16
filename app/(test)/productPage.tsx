// import { icons } from "@/constants";
// import React, { useState, useEffect, useContext } from "react";
// import {
//   Text,
//   View,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
//   FlatList,
//   ViewToken,
//   TextInput,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Product } from "@/lib/types";
// import { CartContext } from "@/context/CartWishListContext";

// const { width: viewportWidth } = Dimensions.get("window");

// interface ProductPageProps {
//   product: Product;
// }

// import data from "@/data/productItems";
// const product = data[2];

// // const Profile:React.FC<ProductPageProps> = ({product}) => {
// const ProductPage: React.FC = () => {
//   const [selectedAttributes, setSelectedAttributes] = useState<{
//     [key: string]: string | [string, string];
//   }>({}); //handling variation selection
//   const [mainImage, setMainImage] = useState(product.mainImage);
//   const [productName, setProductName] = useState<string | "">(product.name);
//   const [activeSlide, setActiveSlide] = useState(0);
//   const { cart, addToCart, clearCart } = useContext(CartContext) || {
//     cart: [],
//     addToCart: () => {},
//     clearCart: () => {},
//   };

//   const images = [mainImage, ...product.otherImages];
//   const [quantity, setQuantity] = useState<number>(10);

//   useEffect(() => {
//     updateProductName();
//   }, [selectedAttributes]);

//   const updateProductName = () => {
//     let updatedProductName = product.name;
//     const selectedValues = Object.values(selectedAttributes).map((value) => {
//       if (Array.isArray(value) && value.length === 2) {
//         return value[0];
//       }
//       return value;
//     });
//     if (selectedValues.length > 0) {
//       updatedProductName += " (" + selectedValues.join(", ") + ")";
//     }
//     setProductName(updatedProductName);
//   };

//   useEffect(() => {
//     // Initialize the default selection
//     const initialSelectedAttributes: {
//       [key: string]: string | [string, string];
//     } = {};
//     let initialMainImage = product.mainImage;

//     Object.keys(product.variations).forEach((attributeName) => {
//       const firstValue = product.variations[attributeName][0];
//       initialSelectedAttributes[attributeName] = firstValue;

//       if (
//         Array.isArray(firstValue) &&
//         firstValue.length === 2 &&
//         firstValue[1]
//       ) {
//         initialMainImage = firstValue[1];
//       }
//     });

//     setSelectedAttributes(initialSelectedAttributes);
//     setMainImage(initialMainImage);
//     setProductName(product.name);
//   }, [product]);

//   const handleAttributeSelection = (
//     attributeName: string,
//     value: string | [string, string]
//   ) => {
//     setSelectedAttributes((prevSelectedAttributes) => {
//       const newSelectedAttributes = {
//         ...prevSelectedAttributes,
//         [attributeName]: value,
//       };

//       // Determine the new main image based on the selected attributes
//       const newMainImage = Object.values(newSelectedAttributes).reduce(
//         (currentImage, selectedValue) => {
//           if (
//             Array.isArray(selectedValue) &&
//             selectedValue.length === 2 &&
//             selectedValue[1]
//           ) {
//             return selectedValue[1];
//           }
//           return currentImage;
//         },
//         product.mainImage
//       );

//       setMainImage(newMainImage as string);
//       return newSelectedAttributes;
//     });
//   };
//   const viewableItemChanges = ({
//     viewableItems,
//   }: {
//     viewableItems: ViewToken[];
//   }) => {
//     if (viewableItems.length > 0) {
//       setActiveSlide(viewableItems[0].index || 0);
//     }
//   };

//   const handleAddToCart = (quantity: number) => {
//     const selectedVariations = Object.keys(selectedAttributes).reduce(
//       (acc, key) => {
//         const value = selectedAttributes[key];
//         acc[key] = Array.isArray(value) ? value[0] : value;
//         return acc;
//       },
//       {} as { [key: string]: string }
//     );

//     const transformValue = (value: string): string => {
//       const parts = value.split(" ");
//       if (parts.length > 1) {
//         return `${parts[0]}(${parts.slice(1).join(")(")})`;
//       }
//       return value;
//     };

//     const skuId = `${product.category
//       .split(/\s+/)
//       .map((word) => word.charAt(0).toUpperCase())
//       .join("")}_${product.name.split(/\s+/)[0].toUpperCase()}_${Object.values(
//       selectedVariations
//     )
//       .map(transformValue)
//       .join("_")
//       .toUpperCase()}`;

//     const productWithVariations = {
//       skuId: skuId,
//       name: productName,
//       category: product.category,
//       // selectedVariations,
//       qty: quantity,
//       // name: productName!,
//     };

//     addToCart(productWithVariations);
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-zinc-150 w-full">
//       <ScrollView>
//         {/* Product Image */}

//         {/* <View className="items-center">
//             <Image
//               source={{
//                 uri: mainImage,
//               }} // Replace with your image URL
//               className="w-full h-96"
//               resizeMode="cover"
//             />
//           </View> */}

//         <View>
//           <FlatList
//             data={images}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => (
//               <View
//                 style={{
//                   width: viewportWidth,
//                   alignItems: "center",
//                   padding: 16,
//                 }}
//               >
//                 <Image source={{ uri: item }} style={styles.image} />
//               </View>
//             )}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onViewableItemsChanged={viewableItemChanges}
//             viewabilityConfig={{
//               itemVisiblePercentThreshold: 90,
//             }}
//           />
//           <View className="flex-row justify-center mt-1">
//             {images.map((_, index) => (
//               <View
//                 key={index}
//                 className={` h-2 w-2 rounded-full mx-1 ${
//                   index === activeSlide ? "bg-secondary" : "bg-primary-200"
//                 }`}
//               />
//             ))}
//           </View>
//         </View>
//         <View className="p-4">
//           {/* Product Name */}
//           <Text className="text-2xl font-lbold mt-0 capitalize">
//             {productName}
//           </Text>
//           {/* Rating and Reviews */}
//           <View className="flex-col items-start mt-2">
//             <Text className="text-secondary font-rregular">
//               {product.category}
//             </Text>
//             <Text className="text-primary-300 mt-1 capitalize font-iregular">
//               {product.description}
//             </Text>
//           </View>

//           {/* Price */}
//           <Text className="text-2xl font-lbold text-primary mt-2">
//             ₹{product.lowerPrice} - ₹{product.upperPrice}
//           </Text>

//           {/* Stock Status */}
//           <Text className="text-green-500 mt-1 font-rregular">In Stock</Text>

//           {/* Variations */}
//           {Object.keys(product.variations).map((attributeName) => (
//             <View key={attributeName} className="mt-4">
//               <Text className="text-primary-300 capitalize font-iregular">
//                 {attributeName}
//               </Text>
//               <View className="flex-row flex-wrap mt-2">
//                 {product.variations[attributeName].map((value, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     onPress={() =>
//                       handleAttributeSelection(attributeName, value)
//                     }
//                     className={`rounded-md py-2 mr-2 mb-2 px-4 ${
//                       selectedAttributes[attributeName] === value
//                         ? "bg-secondary text-black"
//                         : "border border-primary-200"
//                     }`}
//                   >
//                     <Text className="font-rregular">
//                       {Array.isArray(value) ? value[0] : value}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           ))}

//           {/* Add to Cart Button */}
//           <View className="flex-row mt-2 items-center gap-x-2 justify-start">
//             <View className="flex-row items-center justify-start">
//               {/* qty add button */}
//               <TouchableOpacity
//                 className="h-8 w-8 rounded-full mr-2"
//                 onPress={() => setQuantity((prevQty) => prevQty - 1)}
//               >
//                 <Image
//                   source={icons.remove}
//                   className="w-full h-full"
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>

//               {/* qty input */}
//               <TextInput
//                 className="border border-gray-300 rounded-md px-4 py-2 text-center"
//                 keyboardType="numeric"
//                 value={quantity.toString()}
//                 onChangeText={(text) => setQuantity(Number(text))}
//               />

//               {/* qty remove button */}
//               <TouchableOpacity
//                 className="h-8 w-8 rounded-full ml-2"
//                 onPress={() => setQuantity((prevQty) => prevQty + 1)}
//               >
//                 <Image
//                   source={icons.add}
//                   className="w-full h-full"
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//               className="bg-secondary rounded-full py-4 flex-grow"
//               onPress={() => {
//                 handleAddToCart(quantity);
//               }}
//             >
//               <Text className="text-center text-white text-lg font-bold">
//                 Add to Cart
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   image: {
//     width: viewportWidth,
//     height: 384,
//     resizeMode: "cover",
//     borderRadius: 0,
//   },
// });
// export default ProductPage;
import { icons } from "@/constants";
import React, { useState, useEffect, useContext, useMemo } from "react";
import RenderHTML from "react-native-render-html";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product, VariationType, VariationTypes, Variation } from "@/lib/types";
import { CartContext } from "@/context/CartWishListContext";
import { fetchProductData } from "@/services/firebaseFunctions";
import { findUnavailableCombinations } from "@/lib/utilityFunctions";

const { width: viewportWidth } = Dimensions.get("window");

interface ProductPageProps {
  product: Product;
}
interface UnavailableCombination {
  [key: string]: string | [string, string];
}


import data from "@/data/productItems";
const product = data[1];

const aaloo = {
  id: "ry7FcIFpnOruth613BoE",
  createdAt: {
    seconds: 1723709042,
    nanoseconds: 769000000
  },
  mainImage: "http://127.0.0.1:9199/v0/b/jainco.appspot.com/o/images%2F1723708370663_cherry.jpeg?alt=media",
  otherImages: [
    "http://127.0.0.1:9199/v0/b/jainco.appspot.com/o/images%2F1723708414023_JPEG%20image%205.jpeg?alt=media"
  ],
  lowerPrice: 60,
  name: "jainco decor Cherry Table Cover",
  upperPrice: 150,
  description: "<p><strong>cherry table cover </strong></p><ul><li>All over</li><li>Panel</li><li>different sizes from 4 seater to 8 seater</li></ul>",
  variationTypes: {
    size: [
      "40\" x 60\"",
      "54\" x 78\"",
      "60\" x 90\""
    ],
    design: [
      "panel",
      "all over"
    ],
    type: [
      "plain",
      "laced",
      "paipin"
    ]
  },
  category: "table cover",
  variations: [
    {
      id: "4bAx4RRY4YQ5DAMlCeiw",
      isAvailable: true,
      price: 130,
      stock: 0,
      sku: "cherrypaipin_6090",
      variationType: {
        size: "60\" x 90\"",
        design: "all over",
        type: "paipin"
      }
    },
    {
      id: "6jaqrrk8GrEA2lniesCr",
      isAvailable: false,
      price: 100,
      stock: 100,
      sku: "cherry_panel_5478",
      variationType: {
        size: "54\" x 78\"",
        design: "panel",
        type: "plain"
      }
    },
    {
      id: "EKUZzUJ249U6PeWLyAFE",
      isAvailable: true,
      price: 75,
      stock: 0,
      sku: "cherrypaipin_4060",
      variationType: {
        size: "40\" x 60\"",
        design: "all over",
        type: "paipin"
      }
    },
    {
      id: "I6kVjNfhwWqOGuJeMuVb",
      isAvailable: true,
      price: 110,
      stock: 100,
      sku: "cherry_ao_plain_5478",
      variationType: {
        size: "54\" x 78\"",
        design: "all over",
        type: "plain"
      }
    },
    {
      id: "J0enkk3nkWiFKXww63JC",
      isAvailable: false,
      price: 120,
      stock: 100,
      sku: "cherry_panel_6090",
      variationType: {
        size: "60\" x 90\"",
        design: "panel",
        type: "plain"
      }
    },
    {
      id: "O7AxM29TE5fdAs1vonas",
      isAvailable: true,
      price: 75,
      stock: 100,
      sku: "cherry_panel_4060",
      variationType: {
        size: "40\" x 60\"",
        design: "panel",
        type: "plain"
      }
    },
    {
      id: "QJzCS167fc3xAjXlDt3l",
      isAvailable: true,
      price: 115,
      stock: 0,
      sku: "cherrypaipin_5478",
      variationType: {
        size: "54\" x 78\"",
        design: "all over",
        type: "paipin"
      }
    },
    {
      id: "cQizOGmvODvjsQVcm2B7",
      isAvailable: true,
      images: [
        "http://127.0.0.1:9199/v0/b/jainco.appspot.com/o/images%2F1723709027040_hyynl_512.webp?alt=media"
      ],
      price: 110,
      stock: 100,
      sku: "cherrygold_5478",
      variationType: {
        size: "54\" x 78\"",
        design: "all over",
        type: "laced"
      }
    },
    {
      id: "hl4rnUYa6SaJMep1c27W",
      isAvailable: true,
      price: 115,
      stock: 100,
      sku: "cherry_ao_plain_6090",
      variationType: {
        size: "60\" x 90\"",
        design: "all over",
        type: "plain"
      }
    },
    {
      id: "q9fwCm8OvFsQmr4dnf9t",
      isAvailable: true,
      images: [
        "http://127.0.0.1:9199/v0/b/jainco.appspot.com/o/images%2F1723709033215_hyynl_512.webp?alt=media"
      ],
      price: 118,
      stock: 0,
      sku: "cherrygold_6090",
      variationType: {
        size: "60\" x 90\"",
        design: "all over",
        type: "laced"
      }
    },
    {
      id: "qTHmynLYRMgv4S0uWPCJ",
      isAvailable: true,
      price: 75,
      stock: 100,
      sku: "cherry_ao_plain_4060",
      variationType: {
        size: "40\" x 60\"",
        design: "all over",
        type: "plain"
      }
    },
    {
      id: "u5ISsLOXJTajQxzgzW6F",
      isAvailable: true,
      images: [
        "http://127.0.0.1:9199/v0/b/jainco.appspot.com/o/images%2F1723709021729_hyynl_512.webp?alt=media"
      ],
      price: 70,
      stock: 100,
      sku: "cherrygold_4060",
      variationType: {
        size: "40\" x 60\"",
        design: "all over",
        type: "laced"
      }
    }
  ]
}

const ProductPage: React.FC = () => {
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string | [string, string];
  }>({}); //handling variation selection
  const [mainImage, setMainImage] = useState(product.mainImage);
  const [productName, setProductName] = useState<string | "">(product.name);
  const [activeSlide, setActiveSlide] = useState(0);
  const { cart, addToCart, clearCart } = useContext(CartContext) || {
    cart: [],
    addToCart: () => {},
    clearCart: () => {},
  };

  const images = [mainImage, ...product.otherImages];
  const [quantity, setQuantity] = useState<number>(10);
  const [demoProduct, setDemoProduct] = useState<any>(aaloo);

  useEffect(() => {
    updateProductName();
  }, [selectedAttributes]);

  ////////////////////////////////////////// Testing with new product data ////////////////////////////////////////////////

  useEffect(() => {
    const getData = async () => {
      const prod = await fetchProductData({ id: "ry7FcIFpnOruth613BoE" });
      setDemoProduct(prod); // Update state asynchronously
    };

    getData(); // Fetch the data and set the state
  }, []);

  useEffect(()=>{
    console.log('demo prod: ', JSON.stringify(demoProduct, null, 2))
  },[demoProduct])

  // Use useMemo to memoize the unavailable combinations
  const unavailableCombinations = useMemo(() => {
    if (demoProduct && demoProduct.variationTypes && demoProduct.variations) {
      return findUnavailableCombinations(
        demoProduct.variationTypes,
        demoProduct.variations
      );
    }
    return [];
  }, [demoProduct]); // This memo runs whenever demoProduct changes

  useEffect(() => {
    console.log("unavai: ", JSON.stringify(unavailableCombinations, null, 2));
  }, [unavailableCombinations]);

  ////////////////////////////////////////// End: Testing with new product data ////////////////////////////////////////////////

  const updateProductName = () => {
    let updatedProductName = product.name;
    const selectedValues = Object.values(selectedAttributes).map((value) => {
      if (Array.isArray(value) && value.length === 2) {
        return value[0];
      }
      return value;
    });
    if (selectedValues.length > 0) {
      updatedProductName += " (" + selectedValues.join(", ") + ")";
    }
    setProductName(updatedProductName);
  };

  useEffect(() => {
    const initialSelectedAttributes: {
      [key: string]: string | [string, string];
    } = {};
    let initialMainImage = product.mainImage;

    const findFirstAvailableCombination = () => {
      const attributeNames = Object.keys(product.variations);
      const searchCombination = (index: number): boolean => {
        if (index === attributeNames.length) return true;
        const attributeName = attributeNames[index];
        for (const value of product.variations[attributeName]) {
          const testAttributes = {
            ...initialSelectedAttributes,
            [attributeName]: value,
          };
          if (!isCombinationUnavailable(testAttributes)) {
            initialSelectedAttributes[attributeName] = value;
            if (Array.isArray(value) && value.length === 2 && value[1]) {
              initialMainImage = value[1];
            }
            if (searchCombination(index + 1)) return true;
            delete initialSelectedAttributes[attributeName];
          }
        }
        return false;
      };
      searchCombination(0);
    };

    findFirstAvailableCombination();

    setSelectedAttributes(initialSelectedAttributes);
    setMainImage(initialMainImage);
    setProductName(product.name);
  }, [product]);

  const isCombinationUnavailable = (selectedAttributes: {
    [key: string]: string | [string, string];
  }) => {
    return product.unavailableCombinations?.some(
      (combination: UnavailableCombination) =>
        Object.keys(combination).every(
          (key) =>
            selectedAttributes[key] &&
            combination[key] ===
              (Array.isArray(selectedAttributes[key])
                ? (selectedAttributes[key] as [string, string])[0]
                : selectedAttributes[key])
        )
    );
  };

  const handleAttributeSelection = (
    attributeName: string,
    value: string | [string, string]
  ) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    if (isCombinationUnavailable(newAttributes)) {
      return;
    }

    setSelectedAttributes(newAttributes);

    const newMainImage = Object.values(newAttributes).reduce(
      (currentImage, selectedValue) => {
        if (
          Array.isArray(selectedValue) &&
          selectedValue.length === 2 &&
          selectedValue[1]
        ) {
          return selectedValue[1];
        }
        return currentImage;
      },
      product.mainImage
    );

    setMainImage(newMainImage as string);
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
    const selectedVariations = Object.keys(selectedAttributes).reduce(
      (acc, key) => {
        const value = selectedAttributes[key];
        acc[key] = Array.isArray(value) ? value[0] : value;
        return acc;
      },
      {} as { [key: string]: string }
    );

    const transformValue = (value: string): string => {
      const parts = value.split(" ");
      if (parts.length > 1) {
        return `${parts[0]}_${parts.slice(1).join("_")}`;
      }
      return value;
    };

    const skuId = `${product.category
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase())
      .join("")}_${product.name.split(/\s+/)[0].toUpperCase()}_${Object.values(
      selectedVariations
    )
      .map(transformValue)
      .join("_")
      .toUpperCase()}`;

    const productWithVariations = {
      skuId: skuId,
      name: productName,
      category: product.category,
      // selectedVariations,
      qty: quantity,
      // name: productName!,
    };

    addToCart(productWithVariations);
  };

  const {width} = useWindowDimensions()

  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full">
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
            {/* {productName} */}
          {demoProduct.name}
          </Text>
          {/* Category and Description */}
          <View className="flex-col items-start mt-2">
            <Text className="text-secondary font-rregular capitalize">
              {demoProduct.category}
            </Text>
            {/* <Text className="text-primary-300 mt-1 capitalize font-iregular">
              
              {demoProduct.description}
            </Text> */}
            
            <RenderHTML
            contentWidth={width}
            source={{ html: demoProduct.description }}
            />
            
          </View>

          {/* Price */}
          <Text className="text-2xl font-lbold text-primary mt-2">
            ₹{demoProduct.lowerPrice} - ₹{demoProduct.upperPrice}
          </Text>

          {/* Stock Status */}
          <Text className="text-green-500 mt-1 font-rregular">In Stock</Text>

          {/* Variations */}
          {Object.keys(demoProduct.variationTypes).map((attributeName)=>(
            <View key={attributeName} className="mt-4">
              <Text className="text-primary-300 capitalize font-iregular">
                {attributeName}
              </Text>
              <View className="flex-row flex-wrap mt-2">
                {demoProduct.variationTypes[attributeName].map((value:string,index:number)=>{
                  const isDisabled = isCombinationUnavailable({
                    ...selectedAttributes,
                    [attributeName]: value,
                  });
                  const isSelected =
                    selectedAttributes[attributeName] === value;
                  return(
                    <TouchableOpacity
                    key={index}
                    className='rounded-md py-2 mr-2 mb-2 px-4 border border-primary-200'
                    >
                      <Text className="font-rregular text-primary-100 capitalize">{value}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          ))}
          {/* {Object.keys(product.variations).map((attributeName) => (
            <View key={attributeName} className="mt-4">
              <Text className="text-primary-300 capitalize font-iregular">
                {attributeName}
              </Text>

              <View className="flex-row flex-wrap mt-2">
                {product.variations[attributeName].map((value, index) => {
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
                        handleAttributeSelection(attributeName, value)
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
                        className={`font-rregular ${
                          isDisabled && "text-primary-100"
                        }`}
                      >
                        {Array.isArray(value) ? value[0] : value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))} */}

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
          <Text>{cart[3]?.skuId}</Text>
        </View>
      </ScrollView>
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
});
export default ProductPage;


