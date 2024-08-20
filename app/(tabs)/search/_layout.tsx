import { Stack } from "expo-router";
import React from "react";

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[query]" />
      <Stack.Screen name="category" />
      <Stack.Screen name="product" />
    </Stack>
  );
}
