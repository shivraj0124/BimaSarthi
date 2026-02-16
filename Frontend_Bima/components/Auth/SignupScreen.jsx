import { View, Text, TextInput, TouchableOpacity,Alert,ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {t} from "../../localization/translate"
import {useApp} from "../../contexts/AppContext"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";

export default function SignupScreen() {
  const {language,saveUser} = useApp();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const handSignUp = async () => {
    if (!mobileNumber || !password) {
      Alert.alert("Error", "Please enter mobile number and password");
      return;
    }

    try {
      setLoading(true);
      console.log(process.env.EXPO_PUBLIC_API_URL)
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`,
        {
          fullName,
          mobileNumber,
          password,
        }
      );

      console.log("data: " , response?.data);
      const data = response?.data;
      
      if (data?.success) {
        saveUser(data.user);
        // ✅ Save token
        await AsyncStorage.setItem("token", data.token);

        // ✅ Save user (optional but recommended)
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        Alert.alert("Success", data.message);
 
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log("Signup Error:", error.response?.data || error.message);

      if (error.response?.status === 404) {
        Alert.alert("Error", "User not found");
      } else if (error.response?.status === 401) {
        Alert.alert("Error", "Invalid credentials");
      } else {
        Alert.alert("Error", "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-green-50 px-6 justify-center">
      <Text className="text-2xl font-semibold text-green-900 mb-6">
        {t("signup",language)}
      </Text>

      <View className="bg-white rounded-xl p-4 mb-4">
        <TextInput
          placeholder={t("fullname",language)}
          className="text-lg text-green-900"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View className="bg-white rounded-xl p-4 mb-4">
        <TextInput
          placeholder={t("mobileno",language)}
          keyboardType="number-pad"
          className="text-lg text-green-900"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
      </View>

      <View className="bg-white rounded-xl p-4 mb-6">
        <TextInput
          placeholder={t("password",language)}
          secureTextEntry
          className="text-lg text-green-900"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        onPress={handSignUp}
        disabled={loading}
        className="bg-green-600 rounded-xl py-4 flex-row justify-center items-center"
      >
        <Feather name="user-plus" size={20} color="#fff" />
        <Text className="text-lg text-white font-semibold ml-3">
          {t("signup",language)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="mt-4"
      >
        <Text className="text-lg text-green-700 text-center">
          {t("alreadyHaveAccount",language)} {t("login",language)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
