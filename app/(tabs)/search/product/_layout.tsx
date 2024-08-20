import { Stack } from "expo-router";
import React from "react";

export default function CategorySearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[productId]" />
      {/* <Stack.Screen name="category" /> */}
    </Stack>
  );
}