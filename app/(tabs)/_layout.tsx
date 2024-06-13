import { Tabs, Stack } from "expo-router";
import { icons } from "@/constants";
import React, { useContext } from "react";
import { Image, Text, View, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { CartContext } from "@/context/CartWishListContext";
interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  const cartContext = useContext(CartContext);
  const cart = cartContext?.cart || [];

  return (
    <View className="items-center justify-center gap-2">
      <View>
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-6 h-6"
        />
        {name === "Cart" && cart.length > 0 && (
          <View
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "#dcb64a",
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "black", fontSize: 10 }}>{cart.length}</Text>
          </View>
        )}
      </View>
      <Text
        className={`${
          focused ? "font-lbold" : "font-rregular"
        } text-base text-white`}
      >
        {name}
      </Text>
    </View>
  );
};
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#d6b46a",
        tabBarInactiveTintColor: "#848484",
        tabBarStyle: {
          backgroundColor: "#040404",
          borderTopWidth: 2,
          borderTopColor: "#000",
          height: 75,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: "QR",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.qr}
              color={color}
              name="QR"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.cart}
              color={color}
              name="Cart"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarButton: () => null, // Hide tab bar button for search
        }}
      />
    </Tabs>
  );
}
