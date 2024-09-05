import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Picker } from "@react-native-picker/picker"; 

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  gstin?: string;
  aadhar?: string;
  pincode: string;
  districtName: string;
  stateName: string;
}

interface Errors {
  name: string;
  email: string;
  password: string;
  gstin?: string;
  aadhar?: string;
  pincode: string;
}

const SignUp: React.FC = () => {
  const { signUp } = useAuth();

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    gstin: "",
    aadhar: "",
    pincode: "",
    districtName: "",
    stateName: "",
  });
  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    password: "",
    gstin: "",
    aadhar: "",
    pincode: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasGSTIN, setHasGSTIN] = useState<string>("yes"); // Dropdown value for GSTIN or Aadhar

  const nameRegex = /^[a-zA-Z ]{2,30}$/;
  const gstinRegex =
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz][0-9A-Za-z]{1}$/;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

   const aadharRegex =  /^[2-9][0-9]{3}\s[0-9]{4}\s[0-9]{4}$/;

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

  const validateAadhar = (value: string): boolean => {
    if (!value.trim()) {
      setErrors((prevState) => ({
        ...prevState,
        aadhar: "Password is required",
      }));
      return false;
    } else if (!aadharRegex.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        aadhar:
          "Aadhar number should be of 12 digits of 4 digit block",
      }));
      return false;
    }
    setErrors((prevState) => ({ ...prevState, aadhar: "" }));
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
    const lForm = {
      name: form.name.toLowerCase(),
      email: form.email.toLowerCase(),
      password: form.password,
      // gstin: form.gstin.toUpperCase(), // Keep GSTIN in uppercase as per usual format
      pincode: form.pincode.toLowerCase(), // Pincode should remain as numbers
      districtName: form.districtName.toLowerCase(),
      stateName: form.stateName.toLowerCase(),
    };

    const isNameValid = validateName(lForm.name);
    const isEmailValid = validateEmail(lForm.email);
    const isPasswordValid = validatePassword(lForm.password);
    let isGSTINOrAadharValid = true;
    if (hasGSTIN === "yes") {
      isGSTINOrAadharValid = validateGSTIN(form.gstin!);
    } else {
      isGSTINOrAadharValid = validateAadhar(form.aadhar!);
    }
    const isPincodeValid = await validatePincode(lForm.pincode);

    const isValid =
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isGSTINOrAadharValid &&
      isPincodeValid;

    if (isValid) {
      const lowerCaseForm = {
        ...form,
        gstin: form.gstin?.toUpperCase(),
        aadhar: form.aadhar,
      };
      signUp(lowerCaseForm)
        .then(() => {
          setIsSubmitting(false);
        })
        .then(() => {
          // Alert.alert("Success", "Form submitted successfully!");
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
          
          {/* Dropdown for selecting GSTIN or Aadhar */}
          <View className="mt-4">
            <Text className="text-lg text-primary-200">Do you have a GSTIN?</Text>
            <Picker 
            selectedValue={hasGSTIN}
              onValueChange={(value) => setHasGSTIN(value)}
              mode="dropdown"
            >
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>

          {/* Conditionally show GSTIN or Aadhar */}
          {hasGSTIN === "yes" ? (
            <FormField
              title="* GSTIN"
              value={form.gstin || ''}
              handleChangeText={(e) => handleChange("gstin", e, validateGSTIN)}
              otherStyles="mt-4"
              placeholder="07AZYPK0127D1ZE"
            />
          ) : (
            <FormField
              title="* Aadhar"
              value={form.aadhar || ''}
              handleChangeText={(e) => handleChange("aadhar", e, validateAadhar)}
              otherStyles="mt-4"
              placeholder="1234 5678 9012"
              keyboardType="number-pad"
            />
          )}
          {hasGSTIN === "yes" && errors.gstin ? (
            <Text style={{ color: "red" }}>{errors.gstin}</Text>
          ) : null}
          {hasGSTIN === "no" && errors.aadhar ? (
            <Text style={{ color: "red" }}>{errors.aadhar}</Text>
          ) : null}


          {/* <FormField
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
          ) : null} */}
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
