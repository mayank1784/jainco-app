import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../../components/SearchInput";

// import EmptyState from "../../components/EmptyState";
// import { searchPosts } from "../../lib/appwrite";
// import useAppwrite from "../../lib/useAppwrite";
// import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const SearchScreen = () => {
  const { query } = useLocalSearchParams<{ query: string }>();

  //   const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  //   useEffect(() => {
  //     refetch();
  //   }, [query]);

  return (
    <SafeAreaView className="bg-zinc-150 h-full w-full flex justify-center items-center">
      <Text className="text-2xl font-rregular text-black">{query}</Text>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
