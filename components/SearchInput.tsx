import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname, Href } from "expo-router";

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const handleSearch = () => {
    if (!query.trim()) {
      return Alert.alert("Missing query", "Please input something to search");
    }

    try {
      // Always navigate to search results page with the query
      const searchPath = `/search/${encodeURIComponent(
        query.trim()
      )}` as Href<string>;

      // Navigate and clear query
      router.push(searchPath);
      setQuery("");
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Failed to perform search. Please try again.");
    }
  };

  return (
    <View className="border-2 border-primary w-full h-10 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center justify-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-black flex-1 font-iregular"
        value={query}
        placeholder="Search our products"
        placeholderTextColor="#848484"
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity onPress={handleSearch} className="p-2">
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
