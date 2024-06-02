import { Tabs, Stack } from "expo-router";
import { icons } from "@/constants";
import React from "react";
import { Image, Text, View, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />

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
        name="points"
        options={{
          title: "Points",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.points}
              color={color}
              name="Points"
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
