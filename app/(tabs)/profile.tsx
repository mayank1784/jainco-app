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
  const {signOut} = useAuth()
  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full">
      <ScrollView>
        <CustomButton
          title="Sign In"
          handlePress={() => {
            router.push("/sign-in");
          }}
        />
        <CustomButton 
        title="Sign out"
        handlePress={async()=>{
await signOut()
        }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
