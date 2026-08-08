import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { DefaultWidget } from "@msg91comm/sendotp-react-native";
import { useApp } from "../../contexts/AppContext";
import { t } from "../../localization/translate";

const widgetId = "3668686d4651323733313232";
const tokenAuth = "558633T0r6p7pBCC6a773011P1";

export default function SignupScreen() {
  const { language, saveUser } = useApp();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Step 1: Start OTP verification
  const handleVerifyOtp = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid mobile number");
      return;
    }

    setShowWidget(true);
  };

  // Step 2: OTP verification completed
  const handleVerificationComplete = async (result) => {
    console.log("MSG91 Result:", result);

    if (!result.success) {
      Alert.alert("Verification Failed", result.message || "OTP verification failed");
      setShowWidget(false);
      return;
    }

    try {
      setLoading(true);

      // Check if user already exists
      const response = await axios.post(`${API_URL}/auth/check-mobile`, {
        mobileNumber,
      });

      if (response.data.exists) {
        Alert.alert(
          "Account Exists",
          "This mobile number is already registered. Please login.",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/login"),
            },
          ]
        );

        setShowWidget(false);
        return;
      }

      // Mobile verified and user does not exist
      setOtpVerified(true);
      setShowWidget(false);

      Alert.alert("Success", "Mobile number verified successfully");
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Failed to verify mobile number");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Final signup
  const handleSignUp = async () => {
    if (!otpVerified) {
      Alert.alert("Error", "Please verify your mobile number first");
      return;
    }

    if (!fullName || !password) {
      Alert.alert("Error", "Please enter full name and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/signup`, {
        fullName,
        mobileNumber,
        password,
      });

      const data = response.data;

      if (data.success) {
        saveUser(data.user);

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        Alert.alert("Success", data.message);

        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      Alert.alert("Error", error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-green-50 p-6 justify-center">
      <Text className="text-3xl font-bold text-green-800 text-center mb-8">
        {t("signup", language)}
      </Text>

      {/* Full Name */}
      <View className="bg-white rounded-xl p-4 mb-4">
        <TextInput
          placeholder={t("fullname", language)}
          className="text-lg text-green-900"
          value={fullName}
          onChangeText={setFullName}
          editable={otpVerified}
        />
      </View>

      {/* Mobile Number */}
      <View className="bg-white rounded-xl p-4 mb-4 flex-row items-center">
        <TextInput
          placeholder={t("mobileno", language)}
          keyboardType="number-pad"
          className="flex-1 text-lg text-green-900"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          editable={!otpVerified}
          maxLength={10}
        />

        {otpVerified && (
          <Feather name="check-circle" size={22} color="#16a34a" />
        )}
      </View>

      {/* Verify OTP Button */}
      {!otpVerified && (
        <TouchableOpacity
          onPress={handleVerifyOtp}
          disabled={loading}
          className="bg-emerald-500 rounded-xl py-4 items-center mb-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg text-white font-semibold">
              Verify Mobile Number
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Password */}
      <View className="bg-white rounded-xl p-4 mb-6">
        <TextInput
          placeholder={t("password", language)}
          secureTextEntry
          className="text-lg text-green-900"
          value={password}
          onChangeText={setPassword}
          editable={otpVerified}
        />
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        onPress={handleSignUp}
        disabled={loading || !otpVerified}
        className={`rounded-xl py-4 flex-row justify-center items-center ${
          otpVerified ? "bg-green-600" : "bg-gray-400"
        }`}
      >
        <Feather name="user-plus" size={20} color="#fff" />
        <Text className="text-lg text-white font-semibold ml-3">
          {t("signup", language)}
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="mt-4"
      >
        <Text className="text-lg text-green-700 text-center">
          {t("alreadyHaveAccount", language)} {t("login", language)}
        </Text>
      </TouchableOpacity>

      {/* MSG91 OTP Widget */}
      <DefaultWidget
        visible={showWidget}
        onClose={() => setShowWidget(false)}
        onCompletion={handleVerificationComplete}
        widgetId={widgetId}
        tokenAuth={tokenAuth}
      />
    </View>
  );
}