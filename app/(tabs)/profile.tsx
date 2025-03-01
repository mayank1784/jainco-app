import { icons, images } from "@/constants";
import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/lib/types";
import CustomButton from "@/components/CustomButton";
import { Link, router, useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { WebView } from "react-native-webview";
import { auth, db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

interface ProfileProps {
  product: Product;
}

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profileData: any;
  onSave: (updatedData: any) => Promise<void>;
}

interface ProfileFormData {
  name: string;
  pincode: string;
  districtName: string;
  stateName: string;
  gstin?: string;
  aadhar?: string;
}

interface ProfileFormErrors {
  name: string;
  pincode: string;
  gstin?: string;
  aadhar?: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  profileData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ProfileFormErrors>({
    name: "",
    pincode: "",
    gstin: "",
    aadhar: "",
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    name: profileData?.name || "",
    pincode: profileData?.pincode || "",
    districtName: profileData?.districtName || "",
    stateName: profileData?.stateName || "",
    gstin: profileData?.gstin || "",
    aadhar: profileData?.aadhar || "",
  });

  // Validation regex patterns
  const nameRegex = /^[a-zA-Z ]{2,30}$/;
  const gstinRegex =
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz][0-9A-Za-z]{1}$/;
  const aadharRegex = /^[2-9][0-9]{3}\s[0-9]{4}\s[0-9]{4}$/;

  // Validation functions
  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return false;
    } else if (!nameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Name should contain only letters and spaces (2-30 characters)",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  const validateGSTIN = (value: string): boolean => {
    if (!value) return true; // GSTIN is optional when editing
    if (!gstinRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        gstin: "Invalid GSTIN format",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, gstin: "" }));
    return true;
  };

  const validateAadhar = (value: string): boolean => {
    if (!value) return true; // Aadhar is optional when editing
    if (!aadharRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        aadhar: "Aadhar number should be of 12 digits in 4 digit blocks",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, aadhar: "" }));
    return true;
  };

  const validatePincode = async (value: string): Promise<boolean> => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        pincode: "Pincode is required",
      }));
      return false;
    } else if (!/^[0-9]{6}$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        pincode: "Pincode should be a 6-digit number",
      }));
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${value}`
      );
      const data = await response.json();
      if (data[0].Status === "Success") {
        const { District, State } = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          districtName: District,
          stateName: State,
        }));
        setErrors((prev) => ({ ...prev, pincode: "" }));
        return true;
      } else {
        setErrors((prev) => ({
          ...prev,
          pincode: "Invalid pincode",
        }));
        return false;
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      setErrors((prev) => ({
        ...prev,
        pincode: "Error fetching pincode data",
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (
    field: keyof ProfileFormData,
    value: string,
    validateFn: (value: string) => boolean | Promise<boolean>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    await validateFn(value);
  };

  const handleSave = async () => {
    const isNameValid = validateName(formData.name);
    const isPincodeValid = await validatePincode(formData.pincode);
    const isGSTINValid = validateGSTIN(formData.gstin || "");
    const isAadharValid = validateAadhar(formData.aadhar || "");

    if (isNameValid && isPincodeValid && isGSTINValid && isAadharValid) {
      try {
        const updatedData = {
          ...formData,
          name: formData.name.toLowerCase(),
          gstin: formData.gstin?.toUpperCase(),
          pincode: formData.pincode,
          districtName: formData.districtName.toLowerCase(),
          stateName: formData.stateName.toLowerCase(),
        };
        await onSave(updatedData);
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } catch (error) {
        Alert.alert("Error", "Failed to update profile");
      }
    } else {
      Alert.alert("Error", "Please fix the validation errors before saving.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-4/5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Profile Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.close}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Email</Text>
              <Text className="text-gray-600">{profileData?.email}</Text>
              <Text className="text-xs text-gray-400">
                (Email cannot be changed)
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Name</Text>
              {isEditing ? (
                <>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-2"
                    value={formData.name}
                    onChangeText={(text) =>
                      handleChange("name", text, validateName)
                    }
                  />
                  {errors.name ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </Text>
                  ) : null}
                </>
              ) : (
                <Text className="text-gray-600">{profileData?.name}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Pincode</Text>
              {isEditing ? (
                <>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-2"
                    value={formData.pincode}
                    onChangeText={(text) =>
                      handleChange("pincode", text, validatePincode)
                    }
                    keyboardType="numeric"
                  />
                  {errors.pincode ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.pincode}
                    </Text>
                  ) : null}
                </>
              ) : (
                <Text className="text-gray-600">{profileData?.pincode}</Text>
              )}
            </View>

            {isEditing && isLoading ? (
              <ActivityIndicator size="large" color="#dcb64a" />
            ) : (
              <>
                <View className="mb-4">
                  <Text className="text-lg font-semibold mb-2">District</Text>
                  <Text className="text-gray-600">{formData.districtName}</Text>
                </View>

                <View className="mb-4">
                  <Text className="text-lg font-semibold mb-2">State</Text>
                  <Text className="text-gray-600">{formData.stateName}</Text>
                </View>
              </>
            )}

            {profileData?.gstin ? (
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-2">GSTIN</Text>
                {isEditing ? (
                  <>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2"
                      value={formData.gstin}
                      onChangeText={(text) =>
                        handleChange("gstin", text, validateGSTIN)
                      }
                    />
                    {errors.gstin ? (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.gstin}
                      </Text>
                    ) : null}
                  </>
                ) : (
                  <Text className="text-gray-600">{profileData?.gstin}</Text>
                )}
              </View>
            ) : (
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-2">Aadhar</Text>
                {isEditing ? (
                  <>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2"
                      value={formData.aadhar}
                      onChangeText={(text) =>
                        handleChange("aadhar", text, validateAadhar)
                      }
                    />
                    {errors.aadhar ? (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.aadhar}
                      </Text>
                    ) : null}
                  </>
                ) : (
                  <Text className="text-gray-600">{profileData?.aadhar}</Text>
                )}
              </View>
            )}

            <View className="flex-row justify-end mt-4">
              {isEditing ? (
                <>
                  <CustomButton
                    title="Cancel"
                    handlePress={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profileData?.name || "",
                        pincode: profileData?.pincode || "",
                        districtName: profileData?.districtName || "",
                        stateName: profileData?.stateName || "",
                        gstin: profileData?.gstin || "",
                        aadhar: profileData?.aadhar || "",
                      });
                      setErrors({
                        name: "",
                        pincode: "",
                        gstin: "",
                        aadhar: "",
                      });
                    }}
                    containerStyles="mr-2 bg-gray-500 min-h-[40px]"
                  />
                  <CustomButton
                    title="Save"
                    handlePress={handleSave}
                    containerStyles="min-h-[40px]"
                  />
                </>
              ) : (
                <CustomButton
                  title="Edit Profile"
                  handlePress={() => setIsEditing(true)}
                  containerStyles="min-h-[40px]"
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const Profile: React.FC<ProfileProps> = ({ product }) => {
  const { signOut, currentUser, profileData, loading } = useAuth();
  const [webViewKey, setWebViewKey] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleEmailPress = async (companyEmail: string) => {
    const gmailUrl = `intent://send?to=${companyEmail}&subject=Hello&body=I would like to get in touch with you.#Intent;package=com.google.android.gm;end`;
    const mailtoUrl = `mailto:${companyEmail}?subject=Hello&body=I would like to get in touch with you.`;
    try {
      await Linking.openURL(gmailUrl);
    } catch (error) {
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

  const handleUpdateProfile = async (updatedData: any) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, updatedData);
      // The profile data will be automatically updated through the AuthContext
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser?.email) return;

    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your email."
      );
    } catch (error) {
      console.error("Error sending reset email:", error);
      Alert.alert("Error", "Failed to send password reset email");
    }
  };

  useFocusEffect(
    useCallback(() => {
      setWebViewKey((prevKey) => prevKey + 1); // Update the key to re-render the WebView
    }, [])
  );
  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full justify-center items-center m-0 p-0">
      <ScrollView className="w-full">
        <View className="px-2">
          {currentUser && profileData ? (
            <View className="w-full h-auto flex flex-col mt-6 mb-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row justify-start gap-4">
                  <View className="border min-w-max p-3 min-h-max bg-secondary items-center justify-center rounded-full">
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
                    ) : (
                      <Text className="uppercase font-rregular text-primary-300">
                        (AADHAR: {profileData?.aadhar})
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={signOut}
                  disabled={loading}
                  className="w-8 h-8"
                >
                  <Image
                    source={icons.logout}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View className="mt-4 flex-row justify-between">
                <CustomButton
                  title="View Profile"
                  handlePress={() => setShowProfileModal(true)}
                  containerStyles="flex-1 mr-2 min-h-[40px]"
                />
                <CustomButton
                  title="Reset Password"
                  handlePress={handleResetPassword}
                  containerStyles="flex-1 ml-2 min-h-[40px]"
                />
              </View>
            </View>
          ) : (
            <>
              <CustomButton
                title="Sign In"
                handlePress={() => router.push("/sign-in")}
                containerStyles="mt-4 mb-3 w-full"
              />
              <CustomButton
                title="Sign Up"
                handlePress={() => router.push("/sign-up")}
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

        <ProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profileData={profileData}
          onSave={handleUpdateProfile}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
