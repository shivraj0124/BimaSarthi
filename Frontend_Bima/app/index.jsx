import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import { useApp } from "../contexts/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const { isLoggedIn } = useApp();
  const [checkUser, setCheckUser] = useState(null);
  const loadUser = async () => {
    const user = await AsyncStorage.getItem("user");
    const language = await AsyncStorage.getItem("APP_LANG");
    setCheckUser(user ? true : false);
    if (!user) {
      // router.replace("/(tabs)/home");

      if (!language) {
        router.replace("/language");
      } else {
        router.replace("/login");
      }
      //  router.replace("/chatbotss");
    } else {
      router.replace("/(tabs)/home");
    }
  }
  useEffect(() => {
    loadUser()
    console.log("Is Logged In:", isLoggedIn);
    console.log("Is check:", checkUser);

    const timer = setTimeout(() => {
      router.replace("/language");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-green-600 items-center justify-center">
      <Image
        source={require("../assets/images/basics/userP.png")}
        className="w-40 h-40 mb-6"
        resizeMode="contain"
      />
      <Text className="text-2xl font-semibold text-white">
        BimaSaarthi
      </Text>
      <Text className="text-lg text-white mt-2">
        Insurance made simple
      </Text>
    </View>
  );
}
