import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DefaultWidget } from "@msg91comm/sendotp-react-native";
import axios from "axios";

const widgetId = "3668686d4651323733313232";
const tokenAuth = process.env.EXPO_PUBLIC_MSG91_TOKEN_AUTH;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function OtpScreen() {
  const [showWidget, setShowWidget] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerificationComplete = async (result) => {
    console.log("MSG91 Result:", result);

    if (!result?.success) {
      Alert.alert(
        "Verification Failed",
        result?.message || "OTP verification failed.",
      );
      setShowWidget(false);
      return;
    }

    try {
      setLoading(true);

      const accessToken = result?.message;

      if (!accessToken) {
        throw new Error("MSG91 did not return an access token.");
      }

      if (!API_URL) {
        throw new Error("EXPO_PUBLIC_API_URL is not configured.");
      }

      const response = await axios.post(`${API_URL}/auth/verify-widget-token`, {
        accessToken,
      });

      console.log("Backend Verification:", response.data);

      Alert.alert("Success", "Phone verified successfully.");

      /*
       * If your backend returns a JWT, you can save it here:
       *
       * await AsyncStorage.setItem(
       *   "token",
       *   response.data.token
       * );
       *
       * Then navigate:
       *
       * router.replace("/(tabs)");
       */
    } catch (error) {
      console.log(
        "OTP Verification Error:",
        error?.response?.data || error?.message || error,
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Backend verification failed.";

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
      setShowWidget(false);
    }
  };

  const handleOpenWidget = () => {
    if (!tokenAuth) {
      Alert.alert(
        "Configuration Error",
        "MSG91 authentication token is not configured.",
      );
      return;
    }

    if (!API_URL) {
      Alert.alert("Configuration Error", "Backend API URL is not configured.");
      return;
    }

    setShowWidget(true);
  };

  const handleCloseWidget = () => {
    if (!loading) {
      setShowWidget(false);
    }
  };

  return (
    <View className="flex-1 bg-emerald-50 px-6 justify-center">
      {/* Header */}
      <View className="items-center mb-12">
        <View className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-5">
          <Ionicons name="shield-checkmark" size={44} color="#059669" />
        </View>

        <Text className="text-3xl font-bold text-gray-900">BimaSarthi</Text>

        <Text className="text-gray-600 text-center mt-3 text-base leading-6">
          Securely login with your mobile number using OTP verification.
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        onPress={handleOpenWidget}
        disabled={loading || showWidget}
        activeOpacity={0.8}
        className="bg-emerald-500 py-4 rounded-2xl items-center flex-row justify-center"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Ionicons name="phone-portrait" size={22} color="#ffffff" />

            <Text className="text-white font-semibold text-lg ml-2">
              Continue with Phone
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Terms */}
      <Text className="text-xs text-gray-500 text-center mt-6 leading-5">
        By continuing, you agree to receive OTP SMS for secure authentication.
      </Text>

      {/* MSG91 OTP Widget */}
      {showWidget && (
        <DefaultWidget
          visible={showWidget}
          onClose={handleCloseWidget}
          onCompletion={handleVerificationComplete}
          widgetId={widgetId}
          tokenAuth={tokenAuth}
        />
      )}
    </View>
  );
}
