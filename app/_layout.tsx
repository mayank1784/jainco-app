import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { CartWishlistProvider } from "@/context/CartWishListContext";
import { AuthProvider } from "@/context/AuthContext";
import { CategoryProvider } from "@/context/CategoryContex";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "LeagueSpartan-Bold": require("@/assets/fonts/LeagueSpartan-Bold.ttf"),
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
    "Roboto-Regular": require("@/assets/fonts/Roboto-Regular.ttf"),
    "SpaceMono-Regular": require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);
  if (!fontsLoaded && !error) return null;

  return (
    <AuthProvider>
      <CartWishlistProvider>
        <CategoryProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />    
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    
        </Stack>
        </CategoryProvider>
      </CartWishlistProvider>
    </AuthProvider>
  );
}
