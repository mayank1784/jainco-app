import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";
interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  return (
    <View className="border-2 border-primary w-full h-12 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center justify-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-black flex-1 font-iregular"
        value={query}
        placeholder="Search our products"
        placeholderTextColor="#848484"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search"
            );
          }
          if (pathname.startsWith("/search")) {
            router.setParams({ query });
            setQuery("")
          } else {
            setQuery("");
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
