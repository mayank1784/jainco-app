import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all the fields");
    }
    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Unexpected error occurred");
        router.canGoBack();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-zinc-150">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] my-6 px-4">
          <View className="flex-row justify-start items-center gap-x-4">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-12 h-12"
            />
            <Text className="text-black font-lbold text-3xl">JAINCO DECOR</Text>
          </View>
          <Text className="text-2xl text-primary text-semibold mt-10 font-lbold">
            Log in to Jainco Decor
          </Text>
          <FormField
            title="Email"
            value={form.email}
            placeholder="johndoe@example.com"
            handleChangeText={(e) => {
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="xxxxxx"
            handleChangeText={(e) => {
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles=""
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-primary-100 font-pregular">
              Don't have a account ?
            </Text>
            <Link
              className="text-lg font-psemibold text-secondary"
              href="/sign-up"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
