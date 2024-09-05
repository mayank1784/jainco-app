import { icons } from "@/constants";
import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/lib/types";
import CustomButton from "@/components/CustomButton";
import { Link, router, useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { WebView } from "react-native-webview";

interface ProfileProps {
  product: Product;
}

const Profile: React.FC<ProfileProps> = ({ product }) => {
  const { signOut, currentUser, profileData, loading } = useAuth();
  const [webViewKey, setWebViewKey] = useState(0);
  const handleEmailPress = async (companyEmail: string) => {
    const gmailUrl = `intent://send?to=${companyEmail}&subject=Hello&body=I would like to get in touch with you.#Intent;package=com.google.android.gm;end`;
    const mailtoUrl = `mailto:${companyEmail}?subject=Hello&body=I would like to get in touch with you.`;
    try {
      // Try to open Gmail intent
      await Linking.openURL(gmailUrl);
    } catch (error) {
      console.error(
        "Failed to open Gmail app, falling back to default email client:",
        error
      );
      // Fall back to default email client
      Linking.openURL(mailtoUrl).catch((err) =>
        console.error("Failed to open email app:", err)
      );
    }
  };

  const handlePhonePress = (companyPhoneNumber: string) => {
    const phoneUrl = `tel:${companyPhoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Failed to make a call:", err)
    );
  };

  useFocusEffect(
    useCallback(() => {
      setWebViewKey((prevKey) => prevKey + 1); // Update the key to re-render the WebView
    }, [])
  );
  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full justify-center items-center m-0 p-0">
      <ScrollView>
        <View className="px-2">
          {currentUser && profileData ? (
            <View className="w-full h-auto flex flex-row justify-between items-center mt-6 mb-4 overflow-hidden">
              <View className="flex flex-row justify-start gap-4 ">
                <View className="border min-w-max p-3 min-h-max  bg-secondary items-center justify-center rounded-full">
                  <Text className="text-black font-lbold text-2xl uppercase">
                    {profileData?.name
                      .split(" ")
                      .map((word: string) => word[0])
                      .join(".")}
                  </Text>
                </View>
                <View className="w-max h-max flex flex-col justify-center">
                  <Text className="font-rregular text-primary-300">
                    Welcome,
                  </Text>
                  <Text className="uppercase font-rregular text-primary-300">
                    {profileData?.name}
                  </Text>
                  {profileData.gstin ? (
                    <Text className="uppercase font-rregular text-primary-300">
                    (GSTIN: {profileData?.gstin})
                  </Text>
                  ) : ( <Text className="uppercase font-rregular text-primary-300">
                    (AADHAR: {profileData?.aadhar})
                  </Text>)}
                  
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
          ) : (
            <>
              <CustomButton
                title="Sign In"
                handlePress={() => {
                  router.push("/sign-in");
                }}
                containerStyles="mt-4 mb-3 w-full"
              />
              <CustomButton
                title="Sign Up"
                handlePress={() => {
                  router.push("/sign-up");
                }}
                containerStyles="mt-4 mb-5 w-full"
              />
            </>
          )}
        </View>

        <View className="flex-1 flex-col gap-1 rounded-md bg-white m-2">
          <Text className="text-lg pl-2 font-iregular">Contact Us:</Text>
          <TouchableOpacity
            onPress={() => {
              handleEmailPress("jaincodecor@gmail.com");
            }}
          >
            <Text className="text-sm text-blue-500 underline font-rregular pl-2">
              jaincodecor@gmail.com
            </Text>
          </TouchableOpacity>
          <View className="flex-1 flex-row w-full flex-wrap gap-2">
            <TouchableOpacity
              onPress={() => {
                handlePhonePress("+919891521784");
              }}
            >
              <Text className="text-sm text-blue-500 underline font-rregular">
                +91 9891521784
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handlePhonePress("+919818138951");
              }}
            >
              <Text className="text-sm text-blue-500 underline font-rregular">
                +91 9818138951
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handlePhonePress("+911143621784");
              }}
            >
              <Text className="text-sm text-blue-500 underline font-rregular">
                011 43621784
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-lg text-black pl-2 font-iregular">
            Visit Us:{" "}
          </Text>
          <Text className="text-sm font-rregular pl-2 pr-2">
            Jain Enterprises, 2949-B/41, Beadon Pura, Karol Bagh, New Delhi -
            110005
          </Text>
        </View>
        {/* WebView Map Section */}
        <View className="m-2 w-auto h-auto border border-secondary rounded-lg overflow-hidden">
          <WebView
            key={webViewKey}
            source={{
              html: `
            <style>
              body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
              }
              iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 0;
              }
            </style>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14005.160976781877!2d77.1896548!3d28.6510269!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029c6c99bbd5%3A0xc2af68f4609465a8!2sJain%20Enterprises!5e0!3m2!1sen!2sin!4v1724508158091!5m2!1sen!2sin" style="border:0;"  
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>`,
            }}
            className="w-full h-48"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
