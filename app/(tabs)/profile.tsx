import { icons } from "@/constants";
import React from "react";
import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/lib/types";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

interface ProfileProps {
  product: Product;
}

const Profile: React.FC<ProfileProps> = ({ product }) => {
  const { signOut, currentUser, profileData, loading } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full justify-center items-center">
      <ScrollView>
        <View className="px-4">
          <CustomButton
            title="Sign In"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles="mt-10 mb-10 w-[90vw]"
          />

          {/* <Text className="text-red flex text-center px-4">
            {" "}
            {currentUser ? currentUser.email : "aaloo"}
          </Text>
          <Text className="mt-10 text-red flex text-center px-4">
            {" "}
            {profileData ? profileData.stateName : "aaloo"}
          </Text> */}
          <View className="w-full h-auto flex flex-row justify-between items-center mt-6">
            <View className="flex flex-row justify-start gap-3">
              <View className="border min-w-12 px-1 min-h-12 bg-secondary items-center justify-center rounded-full">
                <Text className="text-black font-lbold text-2xl uppercase">
                  {profileData?.name
                    .split(" ")
                    .map((word: string) => word[0])
                    .join(".")}
                </Text>
              </View>
              <View className="w-auto h-12 flex flex-col justify-center">
                <Text className="font-rregular text-primary-300">Welcome,</Text>
                <Text className="uppercase font-rregular text-primary-300">
                  {profileData?.name} (GSTIN: {profileData?.gstin})
                </Text>
              </View>
            </View>
            <View className="w-8 h-8 flex flex-col">
              <TouchableOpacity
                onPress={async () => {
                  await signOut();
                }}
                disabled={loading}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-full h-full"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
