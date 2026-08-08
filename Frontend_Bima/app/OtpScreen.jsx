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
const tokenAuth = "558633T0r6p7pBCC6a773011P1"; // from MSG91 widget
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function OtpScreen() {
  const [showWidget, setShowWidget] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerificationComplete = async (result) => {
    console.log("MSG91 Result:", result);

    if (result.success) {
      try {
        setLoading(true);

        // result.message contains the access token
        const res = await axios.post(
          `${API_URL}/auth/verify-widget-token`,
          { accessToken: result.message }
        );

        console.log("Backend Verification:", res.data);

        Alert.alert("Success", "Phone verified successfully");

        // TODO: Save JWT token and navigate
        // await AsyncStorage.setItem("token", res.data.token);
        // router.replace("/(tabs)");
      } catch (error) {
        console.log(error.response?.data || error.message);
        Alert.alert("Error", "Backend verification failed");
      } finally {
        setLoading(false);
        setShowWidget(false);
      }
    } else {
      Alert.alert("Verification Failed", result.message || "OTP verification failed");
      setShowWidget(false);
    }
  };

  return (
    <View className="flex-1 bg-emerald-50 px-6 justify-center">
      <View className="items-center mb-12">
        <View className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-5">
          <Ionicons name="shield-checkmark" size={44} color="#059669" />
        </View>

        <Text className="text-3xl font-bold text-gray-900">BimaSarthi</Text>

        <Text className="text-gray-600 text-center mt-3 text-base leading-6">
          Securely login with your mobile number using OTP verification.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setShowWidget(true)}
        disabled={loading}
        className="bg-emerald-500 py-4 rounded-2xl items-center flex-row justify-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="phone-portrait" size={22} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Continue with Phone
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 text-center mt-6 leading-5">
        By continuing, you agree to receive OTP SMS for secure authentication.
      </Text>

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