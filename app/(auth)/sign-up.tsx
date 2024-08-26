import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  gstin: string;
  pincode: string;
  districtName: string;
  stateName: string;
}

interface Errors {
  name: string;
  email: string;
  password: string;
  gstin: string;
  pincode: string;
}

const SignUp: React.FC = () => {
  const { signUp } = useAuth();

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    gstin: "",
    pincode: "",
    districtName: "",
    stateName: "",
  });
  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    password: "",
    gstin: "",
    pincode: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const nameRegex = /^[a-zA-Z ]{2,30}$/;
  const gstinRegex =
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz][0-9A-Za-z]{1}$/;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setErrors((prevState) => ({ ...prevState, name: "Name is required" }));
      return false;
    } else if (!nameRegex.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        name: "Name should contain only letters and spaces (2-30 characters)",
      }));
      return false;
    }
    setErrors((prevState) => ({ ...prevState, name: "" }));
    return true;
  };

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setErrors((prevState) => ({ ...prevState, email: "Email is required" }));
      return false;
    } else if (!emailRegex.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Invalid email format",
      }));
      return false;
    }
    setErrors((prevState) => ({ ...prevState, email: "" }));
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value.trim()) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password is required",
      }));
      return false;
    } else if (!passRegex.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        password:
          "Password should contain at least 8 characters, including uppercase, lowercase, number, and special character",
      }));
      return false;
    }
    setErrors((prevState) => ({ ...prevState, password: "" }));
    return true;
  };

  const validateGSTIN = (value: string): boolean => {
    if (!value.trim()) {
      setErrors((prevState) => ({ ...prevState, gstin: "GSTIN is required" }));
      return false;
    } else if (!gstinRegex.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        gstin: "Invalid GSTIN format",
      }));
      return false;
    }
    setErrors((prevState) => ({ ...prevState, gstin: "" }));
    return true;
  };

  const validatePincode = async (value: string): Promise<boolean> => {
    if (!value.trim()) {
      setErrors((prevState) => ({
        ...prevState,
        pincode: "Pincode is required",
      }));
      return false;
    } else if (!/^[0-9]{6}$/.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
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
        setForm((prevForm) => ({
          ...prevForm,
          districtName: District,
          stateName: State,
        }));
        setErrors((prevState) => ({ ...prevState, pincode: "" }));
        setIsLoading(false);
        return true;
      } else {
        setErrors((prevState) => ({
          ...prevState,
          pincode: "Invalid pincode",
        }));
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      setErrors((prevState) => ({
        ...prevState,
        pincode: "Error fetching pincode data",
      }));
      setIsLoading(false);
      return false;
    }
  };

  const handleChange = (
    field: keyof SignUpForm,
    value: string,
    validateFn: (value: string) => boolean | Promise<boolean>
  ) => {
    setForm((prevState) => ({ ...prevState, [field]: value }));
    validateFn(value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const lowerCaseForm = {
      name: form.name.toLowerCase(),
      email: form.email.toLowerCase(),
      password: form.password,
      gstin: form.gstin.toUpperCase(), // Keep GSTIN in uppercase as per usual format
      pincode: form.pincode.toLowerCase(), // Pincode should remain as numbers
      districtName: form.districtName.toLowerCase(),
      stateName: form.stateName.toLowerCase(),
    };

    const isNameValid = validateName(lowerCaseForm.name);
    const isEmailValid = validateEmail(lowerCaseForm.email);
    const isPasswordValid = validatePassword(lowerCaseForm.password);
    const isGSTINValid = validateGSTIN(lowerCaseForm.gstin);
    const isPincodeValid = await validatePincode(lowerCaseForm.pincode);

    const isValid =
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isGSTINValid &&
      isPincodeValid;

    if (isValid) {
      signUp(lowerCaseForm)
        .then(() => {
          setIsSubmitting(false);
        })
        .then(() => {
          Alert.alert("Success", "Form submitted successfully!");
          // console.log("Form submitted successfully:", lowerCaseForm);
          router.replace("/sign-in");
        })
        .catch((error: any) => {
          Alert.alert("Error", error.message);
          setIsSubmitting(false);
        })
        .finally(() => setIsSubmitting(false));
    } else {
      console.log("Form has validation errors. Cannot submit.");
      setIsSubmitting(false);
      Alert.alert("Error", "Form has validation errors. Cannot submit.");
    }
  };

  return (
    <SafeAreaView className="bg-zinc-150 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] my-2 px-4">
          <View className="flex-row justify-start items-center gap-x-4">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-12 h-12"
            />
            <Text className="text-black font-lbold text-3xl">JAINCO DECOR</Text>
          </View>
          <Text className="text-2xl text-primary-300 text-semibold mt-3 font-lbold">
            Sign Up to Jainco Decor
          </Text>
          <FormField
            title="* Name"
            value={form.name}
            handleChangeText={(e) => {
              handleChange("name", e, validateName);
            }}
            otherStyles="mt-5"
            placeholder="John Doe"
          />
          {errors.name ? (
            <Text style={{ color: "red" }}>{errors.name}</Text>
          ) : null}
          <FormField
            title="* Email"
            value={form.email}
            handleChangeText={(e) => {
              handleChange("email", e, validateEmail);
            }}
            otherStyles="mt-4"
            keyboardType="email-address"
            placeholder="user@jaincodecor.com"
          />
          {errors.email ? (
            <Text style={{ color: "red" }}>{errors.email}</Text>
          ) : null}
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => {
              handleChange("password", e, validatePassword);
            }}
            otherStyles="mt-4"
            placeholder="xxxxxx"
          />
          {errors.password ? (
            <Text style={{ color: "red" }}>{errors.password}</Text>
          ) : null}
          <FormField
            title="* GSTIN"
            value={form.gstin}
            handleChangeText={(e) => {
              handleChange("gstin", e, validateGSTIN);
            }}
            otherStyles="mt-4"
            placeholder="07AZYPK0127D1ZE"
            // onEndEditing={validateGstin}
          />
          {errors.gstin ? (
            <Text style={{ color: "red" }}>{errors.gstin}</Text>
          ) : null}
          <FormField
            title="* Pincode"
            value={form.pincode}
            handleChangeText={(e) => {
              handleChange("pincode", e, validatePincode);
            }}
            otherStyles="mt-4"
            placeholder="110005"
            keyboardType="number-pad"
          />
          {errors.pincode ? (
            <Text style={{ color: "red" }}>{errors.pincode}</Text>
          ) : null}
          {isLoading ? (
            <ActivityIndicator size="large" color={"#dcb64a"} />
          ) : (
            <>
              <FormField
                title="District"
                value={form.districtName}
                handleChangeText={() => {
                  return;
                }}
                otherStyles="mt-4"
                placeholder="Central Delhi"
              />
              <FormField
                title="State"
                value={form.stateName}
                handleChangeText={() => {
                  return;
                }}
                otherStyles="mt-4"
                placeholder="Delhi"
              />
            </>
          )}

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-4"
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
