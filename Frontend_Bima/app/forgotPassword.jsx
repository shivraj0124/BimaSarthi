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
import axios from "axios";
import { DefaultWidget } from "@msg91comm/sendotp-react-native";

const widgetId = "3668686d4651323733313232";
const tokenAuth = "558633T0r6p7pBCC6a773011P1";

export default function ForgotPasswordScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleVerifyOtp = () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid mobile number");
      return;
    }

    setShowWidget(true);
  };

  const handleVerificationComplete = (result) => {
    console.log("OTP Result:", result);

    if (result.success) {
      setOtpVerified(true);
      Alert.alert("Success", "Mobile number verified successfully");
    } else {
      Alert.alert("Error", result.message || "OTP verification failed");
    }

    setShowWidget(false);
  };

  const handleResetPassword = async () => {
    if (!otpVerified) {
      Alert.alert("Error", "Please verify your mobile number first");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        mobileNumber,
        newPassword,
      });

      if (response.data.success) {
        Alert.alert("Success", response.data.message, [
          {
            text: "Go to Login",
            onPress: () => router.replace("/login"),
          },
        ]);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-green-50 p-6 justify-center">
      <Text className="text-3xl font-bold text-green-800 text-center mb-8">
        Forgot Password
      </Text>

      {/* Mobile Number */}
      <View className="bg-white rounded-xl p-4 mb-4 flex-row items-center">
        <TextInput
          placeholder="Enter mobile number"
          keyboardType="number-pad"
          maxLength={10}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          editable={!otpVerified}
          className="flex-1 text-lg text-green-900"
        />

        {otpVerified && (
          <Feather name="check-circle" size={22} color="#16a34a" />
        )}
      </View>

      {/* Verify OTP */}
      {!otpVerified && (
        <TouchableOpacity
          onPress={handleVerifyOtp}
          className="bg-emerald-500 rounded-xl py-4 items-center mb-4"
        >
          <Text className="text-lg text-white font-semibold">
            Verify OTP
          </Text>
        </TouchableOpacity>
      )}

      {/* New Password */}
      <View className="bg-white rounded-xl p-4 mb-6">
        <TextInput
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          editable={otpVerified}
          className="text-lg text-green-900"
        />
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        onPress={handleResetPassword}
        disabled={!otpVerified || loading}
        className={`rounded-xl py-4 flex-row justify-center items-center ${
          otpVerified ? "bg-green-600" : "bg-gray-400"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Feather name="lock" size={20} color="#fff" />
            <Text className="text-lg text-white font-semibold ml-3">
              Reset Password
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* MSG91 Widget */}
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