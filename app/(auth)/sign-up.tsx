import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    if (form.name === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all the fields");
    }
    setIsSubmitting(true);
    try {
      await SignUp(form.email, form.password);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-zinc-150 h-full">
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
          <Text className="text-2xl text-primary-300 text-semibold mt-10 font-lbold">
            Sign Up to Jainco Decor
          </Text>
          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => {
              setForm({ ...form, name: e });
            }}
            otherStyles="mt-10"
            placeholder="John Doe"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => {
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="user@jaincodecor.com"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => {
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-7"
            placeholder="xxxxxx"
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-primary-200 font-pregular">
              Have an account already ?
            </Text>
            <Link
              className="text-lg font-psemibold text-secondary"
              href="/sign-in"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
