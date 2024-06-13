import { useState, useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import CategoryGrid from "@/components/CategoryGrid";
import CartWishlistIcons from "@/components/CartWishListIcons";
const data = [
  {
    id: "1",
    title: "Table Covers",
    photoUrl:
      "https://tiimg.tistatic.com/fp/1/006/882/home-furnishing-curtains-cushion-etc--228.jpg",
  },
  {
    id: "2",
    title: "Table Runners",
    photoUrl:
      "https://images.woodenstreet.de/image/data/HOMEWARDS/TABLE%20RUNNER/digital-printed-printed-blue-mughal-tree-table-runner-72-13-inch)/H-3.jpg",
  },
  {
    id: "3",
    title: "Mattress Protectors",
    photoUrl:
      "https://m.media-amazon.com/images/I/71-grzeNbLL._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: "4",
    title: "Washing Machine Covers",
    photoUrl:
      "https://jdbasket.in/cdn/shop/files/high_quality_zipper_image_jpg.jpg",
  },
  {
    id: "5",
    title: "Fridge Top Covers",
    photoUrl:
      "https://5.imimg.com/data5/SELLER/Default/2022/11/FE/JQ/RY/125510900/waterproof-refrigerator-cover.jpg",
  },
  {
    id: "6",
    title: "Wallpapers",
    photoUrl:
      "https://5.imimg.com/data5/GG/KS/BN/SELLER-106630672/premium-wallpaper-roll-0-53-x-10-meters-50-sqft--500x500.jpg",
  },
  {
    id: "7",
    title: "Table Cloths",
    photoUrl:
      "https://m.media-amazon.com/images/I/71I9MwrXL6L._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: "8",
    title: "Aprons",
    photoUrl: "https://m.media-amazon.com/images/I/81dw36-jlnL._AC_UY1100_.jpg",
  },
  {
    id: "9",
    title: "Curtains",
    photoUrl: "https://drapestory.in/cdn/shop/files/550_1_jpg.jpg?v=1691592956",
  },
  {
    id: "10",
    title: "Sofa Covers",
    photoUrl:
      "https://m.media-amazon.com/images/I/A16famgNV+L._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: "81",
    title: "Chair Covers",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "91",
    title: "Bed Mats",
    photoUrl:
      "https://www.bigbasket.com/media/uploads/p/l/40242945-3_1-kuber-industries-dot-design-pvc-food-matbed-server-reversible-waterproof-blue-standard.jpg",
  },
  {
    id: "1d",
    title: "Item 1",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "2s",
    title: "Item 2",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "3a",
    title: "Item 3",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "4s",
    title: "Item 4",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "5s",
    title: "Item 5",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "6d",
    title: "Item 6",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "7w",
    title: "Item 4",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "8s",
    title: "Item 5",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "9a",
    title: "Item 6",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "1s0",
    title: "Item 4",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "81r",
    title: "Item 5",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "91d",
    title: "Item 6",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
];
export default function Index() {
  const [isEndOfListReached, setIsEndOfListReached] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleEndReached = () => {
    setIsEndOfListReached(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    console.log(offsetY);
    if (offsetY < prevScrollPos) {
      setIsEndOfListReached(false);
    }
    setPrevScrollPos(offsetY);
  };

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
          <Text className="text-black font-lbold text-[28px]">JAINCO DECOR</Text>
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
      <CategoryGrid
        data={data}
        onEndReachedThreshold={0.1} // Set a threshold of 50%
        onEndReached={handleEndReached}
      />
      {isEndOfListReached && (
        <View className="mt-4 bg-secondary w-full h-10">
          <Text className="text-lg text-center text-primary"> aaloo</Text>
        </View>
      )}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
