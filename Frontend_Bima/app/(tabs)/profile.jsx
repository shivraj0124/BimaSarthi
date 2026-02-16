import { Feather, Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../contexts/AppContext";
import { t } from "../../localization/translate";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import axios from "axios";

export default function ProfileScreen() {
  const { darkMode, language, saveUser ,user} = useApp();

  // const [user, setUser] = useState({})
  var data = {}
  const loadData = async () => {
    try {
      const res = await AsyncStorage.getItem("user")
      
      data = res
      console.log(user.id)
    } catch (err) {

    }
  }
  const loadUserFromAPI = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/getSingleUser`,
        {
          userId: user?._id,
        }
      );

      if (res.data.success) {
        // setUser(res.data.user);
        saveUser(res.data.user);

        // optional: keep storage in sync
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }
    } catch (error) {
      console.error("Fetch user failed:", error.response?.data || error.message);
    }
  };


  const handleClick = () => {
    // Handle option click
    router.replace("/language");
  }
  useEffect(() => {
    loadData();
    loadUserFromAPI()
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('APP_LANG');
      saveUser({});
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  // Dummy user data (replace later with API data)
  // const user = {
  //   name: "Raj Kolwankar",
  //   mobile: "9876543210",
  //   age: "24",
  //   occupation: "Student",
  //   location: "Satara, Maharashtra",
  //   income: "Below ₹25,000",
  // };

  // User details with icons
  const userDetails = [
    { icon: "calendar-outline", label: t("age", language), value: user?.surveyResponses?.ageGroup },
    { icon: "briefcase-outline", label: t("occupation", language), value: user?.surveyResponses?.occupation },
    { icon: "location-outline", label: t("location", language), value: `${user?.location?.village ? user?.location?.village:""} ${user?.location?.district ? user?.location?.district:""} ${user?.location?.state ? user?.location?.state:"-"} ` },
    { icon: "wallet-outline", label: t("income", language), value: user?.surveyResponses?.incomeRange },
  ];

  // Settings options
  const settingsOptions = [
    { icon: "person-outline", label: "Edit Profile", color: "#10b981" },
    { icon: "shield-checkmark-outline", label: "Privacy & Security", color: "#3b82f6" },
    { icon: "notifications-outline", label: "Notifications", color: "#f59e0b" },
    { icon: "language-outline", label: "Language", color: "#8b5cf6" },
    { icon: "help-circle-outline", label: "Help & Support", color: "#06b6d4" },
  ];

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={darkMode ? ['#1f2937', '#111827'] : ['#10b981', '#059669']}
          className="px-5 pt-8 pb-24"
        >
          <View className="items-center">
            {/* Profile Image with Ring */}
            <View
              className="relative"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              {/* <Image
                source={require("../../assets/images/basics/userP.png")}
                className="w-[50px] h-[50px] rounded-full"
                resizeMode="cover"
              /> */}
              <View className="h-12 w-12 rounded-[50%] bg-white items-center justify-center">
                <Text className="text-lg font-bold text-black">{user?.fullName?.[0] || "U"}</Text>
              </View>

              {/* Online Status Indicator */}
              {/* <View className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-white" /> */}
            </View>

            {/* Name */}
            <Text className="mt-6 text-3xl font-bold text-white">
              {user?.fullName}
            </Text>

            {/* Mobile */}
            <View className="flex-row items-center mt-2">
              <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text className="ml-2 text-white text-base">
                +91 {user?.mobileNumber}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* User Details Card (Elevated) */}
        <View className="px-5 -mt-16 mb-6">
          <View
            className={`rounded-3xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Personal Information
            </Text>

            {userDetails.map((detail, index) => (
              <View
                key={index}
                className={`flex-row items-center py-4 ${index !== userDetails.length - 1
                  ? "border-b border-gray-200 dark:border-gray-700"
                  : ""
                  }`}
              >
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name={detail.icon} size={20} color="#059669" />
                </View>
                <View className="ml-4 flex-1">
                  <Text
                    className={`text-lg mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    {detail.label}
                  </Text>
                  <Text
                    className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {detail.value ? t(detail.value,language) : "N/A"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View className="px-5 mb-6">
          <Text
            className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Settings
          </Text>

          <View
            className={`rounded-3xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={handleClick}
                className={`flex-row items-center justify-between p-4 ${index !== settingsOptions.length - 1
                  ? "border-b border-gray-200 dark:border-gray-700"
                  : ""
                  }`}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    <Ionicons name={option.icon} size={20} color={option.color} />
                  </View>
                  <Text
                    className={`ml-4 text-base font-medium ${darkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {option.label}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={darkMode ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-5 mb-6">
          <Text
            className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Quick Stats
          </Text>

          <View className="flex-row gap-3">
            {/* Saved Plans */}
            <View
              className="flex-1 rounded-2xl p-4"
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-3">
                <Ionicons name="bookmark" size={24} color="#059669" />
              </View>
              <Text
                className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                12
              </Text>
              <Text
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Saved Plans
              </Text>
            </View>

            {/* Surveys Taken */}
            <View
              className="flex-1 rounded-2xl p-4"
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-3">
                <Ionicons name="checkbox" size={24} color="#3b82f6" />
              </View>
              <Text
                className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                3
              </Text>
              <Text
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Surveys Taken
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-5">
          <TouchableOpacity
            className="rounded-2xl overflow-hidden"
            onPress={logout}
            style={{
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 flex-row items-center justify-center"
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="ml-3 text-white text-base font-bold">
                Logout
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}