import { Stack } from "expo-router";
import React from "react";

export default function ProductSearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // Optional: adds transition animation
      }}
    >
      <Stack.Screen
        name="[productId]"
        options={{
          presentation: "card",
        }}
      />
      {/* <Stack.Screen name="category" /> */}
    </Stack>
  );
}
