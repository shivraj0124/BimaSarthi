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
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "../../localization/translate";
import { useApp } from "../../contexts/AppContext";

export default function LoginScreen() {
  const { language,saveUser } = useApp();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert("Error", "Please enter mobile number and password");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          mobileNumber,
          password,
        }
      );
      

      const data = response.data;

      if (data.success) {
        await AsyncStorage.setItem("token", data.token);

        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        saveUser(data.user);
        Alert.alert("Success", data.message);

        router.replace("/(tabs)/home");
      }
    } catch (error) {
      
      if (error.response?.status === 404) {
        Alert.alert("Error", "User not found");
      } else if (error.response?.status === 401) {
        Alert.alert("Error", "Invalid credentials");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-green-50 px-6 justify-center">
      <Text className="text-2xl font-semibold text-green-900 mb-6">
        {t("login", language)}
      </Text>

      <View className="bg-white rounded-xl p-4 mb-4">
        <TextInput
          placeholder={t("mobileno", language)}
          keyboardType="number-pad"
          className="text-lg text-green-900"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
      </View>

      <View className="bg-white rounded-xl p-4 mb-6">
        <TextInput
          placeholder={t("password", language)}
          secureTextEntry
          className="text-lg text-green-900"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
  onPress={() => router.push("/forgotPassword")}
  className="mb-4 self-end"
>
  <Text className="text-green-700 font-medium">
    Forgot Password?
  </Text>
</TouchableOpacity>


      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-green-600 rounded-xl py-4 flex-row justify-center items-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Feather name="log-in" size={20} color="#fff" />
            <Text className="text-lg text-white font-semibold ml-3">
              {t("login", language)}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/signup")}
        className="mt-4"
      >
        <Text className="text-lg text-green-700 text-center">
          {t("newUser", language)} {t("signup", language)}
        </Text>
      </TouchableOpacity>

      
    </View>
  );
}
