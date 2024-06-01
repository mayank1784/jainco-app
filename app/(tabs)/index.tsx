import { useState, useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import CategoryGrid from "@/components/CategoryGrid";
const data = [
  {
    id: "1",
    title: "Item 1",
    photoUrl:
      "https://tiimg.tistatic.com/fp/1/006/882/home-furnishing-curtains-cushion-etc--228.jpg",
  },
  {
    id: "2",
    title: "Item 2",
    photoUrl:
      "https://images.woodenstreet.de/image/data/HOMEWARDS/TABLE%20RUNNER/digital-printed-printed-blue-mughal-tree-table-runner-72-13-inch)/H-3.jpg",
  },
  {
    id: "3",
    title: "Item 3",
    photoUrl:
      "https://m.media-amazon.com/images/I/71-grzeNbLL._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: "4",
    title: "Item 4",
    photoUrl:
      "https://jdbasket.in/cdn/shop/files/high_quality_zipper_image_jpg.jpg",
  },
  {
    id: "5",
    title: "Item 5",
    photoUrl:
      "https://5.imimg.com/data5/SELLER/Default/2022/11/FE/JQ/RY/125510900/waterproof-refrigerator-cover.jpg",
  },
  {
    id: "6",
    title: "Item 6",
    photoUrl:
      "https://5.imimg.com/data5/GG/KS/BN/SELLER-106630672/premium-wallpaper-roll-0-53-x-10-meters-50-sqft--500x500.jpg",
  },
  {
    id: "7",
    title: "Item 7",
    photoUrl:
      "https://m.media-amazon.com/images/I/71I9MwrXL6L._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: "8",
    title: "Item 8",
    photoUrl: "https://m.media-amazon.com/images/I/81dw36-jlnL._AC_UY1100_.jpg",
  },
  {
    id: "9",
    title: "Item 9",
    photoUrl: "https://drapestory.in/cdn/shop/files/550_1_jpg.jpg?v=1691592956",
  },
  {
    id: "10",
    title: "Item 10",
    photoUrl:
      "https://m.media-amazon.com/images/I/A16famgNV+L._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: "81",
    title: "Item 11",
    photoUrl:
      "https://rukminim2.flixcart.com/image/850/1000/l1zc6fk0/slipcover/4/l/s/6-0-15-s4h-cc-1145-6-ohello-110-original-imagdfd6yughhprq.jpeg?q=90&crop=false",
  },
  {
    id: "91",
    title: "Item 12",
    photoUrl:
      "https://www.bigbasket.com/media/uploads/p/l/40242945-3_1-kuber-industries-dot-design-pvc-food-matbed-server-reversible-waterproof-blue-standard.jpg",
  },
  { id: "1d", title: "Item 1", photoUrl: "" },
  { id: "2s", title: "Item 2", photoUrl: "" },
  { id: "3a", title: "Item 3", photoUrl: "" },
  { id: "4s", title: "Item 4", photoUrl: "" },
  { id: "5s", title: "Item 5", photoUrl: "" },
  { id: "6d", title: "Item 6", photoUrl: "" },
  { id: "7w", title: "Item 4", photoUrl: "" },
  { id: "8s", title: "Item 5", photoUrl: "" },
  { id: "9a", title: "Item 6", photoUrl: "" },
  { id: "1s0", title: "Item 4", photoUrl: "" },
  { id: "81r", title: "Item 5", photoUrl: "" },
  { id: "91d", title: "Item 6", photoUrl: "" },
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
    <SafeAreaView className="h-full bg-zinc-150 w-full">
      {/* <ScrollView className="px-4"> */}
      <View className="flex flex-row justify-between items-center mt-0.4 px-2 gap-3">
        {/* <Image source={images.logo} resizeMode="contain" className="w-6 h-6" /> */}
        <View className="flex flex-row justify-center items-center h-20 w-20">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View className="flex flex-col justify-center items-center">
          <Text className="text-black font-lbold text-4xl">JAINCO DECOR</Text>
          <Text className="text-lg text-black font-rregular">
            Decor your Dream Home
          </Text>
        </View>
      </View>
      <View className="mt-4 px-4">
        <SearchInput />
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
