import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";

import { useApp } from "../../contexts/AppContext";
import { t } from "../../localization/translate";

export default function ProfileScreen() {
  const { darkMode, language, saveUser, user } = useApp();

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER FROM API
  // =====================================================

  const loadUserFromAPI = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      if (!user?._id) {
        setLoading(false);
        return;
      }

      const API_URL = process.env.EXPO_PUBLIC_API_URL;

      if (!API_URL) {
        console.log("EXPO_PUBLIC_API_URL is not configured.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/auth/getSingleUser`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success && response.data?.user) {
        const latestUser = response.data.user;

        saveUser(latestUser);

        await AsyncStorage.setItem("user", JSON.stringify(latestUser));
      }
    } catch (error) {
      console.log(
        "Fetch user failed:",
        error?.response?.data || error?.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SETTINGS NAVIGATION
  // =====================================================

  const handleSettingPress = (option) => {
    if (!option?.route) return;

    if (option.route === "/login") {
      router.replace(option.route);
      return;
    }

    router.push(option.route);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("APP_LANG");

      saveUser({});

      router.replace("/login");
    } catch (error) {
      console.log("Logout failed:", error?.message);
    }
  };

  // =====================================================
  // FETCH USER
  // =====================================================

  useEffect(() => {
    loadUserFromAPI();
  }, [user?._id]);

  // =====================================================
  // USER DETAILS
  // =====================================================

  const userDetails = [
    {
      icon: "calendar-outline",
      label: t("age", language),
      value: user?.surveyResponses?.ageGroup,
    },
    {
      icon: "briefcase-outline",
      label: t("occupation", language),
      value: user?.surveyResponses?.occupation,
    },
    {
      icon: "location-outline",
      label: t("location", language),
      value: [
        user?.location?.village,
        user?.location?.district,
        user?.location?.state,
      ]
        .filter(Boolean)
        .join(", "),
    },
    {
      icon: "wallet-outline",
      label: t("income", language),
      value: user?.surveyResponses?.incomeRange,
    },
  ];

  // =====================================================
  // SETTINGS OPTIONS
  // =====================================================

  const settingsOptions = [
    {
      icon: "person-outline",
      label: "Edit Profile",
      color: "#10b981",
      route: "/profile",
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy & Security",
      color: "#3b82f6",
      route: "/profile",
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      color: "#f59e0b",
      route: "/profile",
    },
    {
      icon: "language-outline",
      label: "Language",
      color: "#8b5cf6",
      route: "/language",
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      color: "#06b6d4",
      route: "/profile",
    },
  ];

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading && !user?._id) {
    return (
      <SafeAreaView
        edges={["top"]}
        className={`flex-1 items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <ActivityIndicator size="large" color="#10b981" />

        <Text
          className={`mt-4 text-base ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* ================================================= */}
        {/* PROFILE HEADER */}
        {/* ================================================= */}

        <LinearGradient
          colors={darkMode ? ["#1f2937", "#111827"] : ["#10b981", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 90,
          }}
        >
          <View className="items-center">
            {/* Profile Avatar */}

            <View
              className="relative"
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <View
                className="h-20 w-20 rounded-full items-center justify-center"
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: 4,
                  borderColor: "rgba(255,255,255,0.35)",
                }}
              >
                <Text className="text-3xl font-bold text-emerald-700">
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
            </View>

            {/* Name */}

            <Text className="mt-5 text-3xl font-bold text-white text-center">
              {user?.fullName || "User"}
            </Text>

            {/* Mobile */}

            {user?.mobileNumber && (
              <View className="flex-row items-center mt-2">
                <Ionicons
                  name="call-outline"
                  size={16}
                  color="rgba(255,255,255,0.85)"
                />

                <Text className="ml-2 text-white text-base">
                  +91 {user.mobileNumber}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* ================================================= */}
        {/* PERSONAL INFORMATION */}
        {/* ================================================= */}

        <View className="px-5 -mt-16 mb-6">
          <View
            className={`rounded-3xl p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 8,
              },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              className={`text-lg font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Personal Information
            </Text>

            {userDetails.map((detail, index) => (
              <View
                key={detail.label}
                className={`flex-row items-center py-4 ${
                  index !== userDetails.length - 1
                    ? darkMode
                      ? "border-b border-gray-700"
                      : "border-b border-gray-200"
                    : ""
                }`}
              >
                {/* Icon */}

                <View
                  className="w-11 h-11 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: darkMode
                      ? "rgba(16,185,129,0.15)"
                      : "#dcfce7",
                  }}
                >
                  <Ionicons name={detail.icon} size={20} color="#059669" />
                </View>

                {/* Details */}

                <View className="ml-4 flex-1">
                  <Text
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {detail.label}
                  </Text>

                  <Text
                    className={`text-base font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {detail.value || "N/A"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ================================================= */}
        {/* SETTINGS */}
        {/* ================================================= */}

        <View className="px-5 mb-6">
          <Text
            className={`text-lg font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Settings
          </Text>

          <View
            className={`rounded-3xl overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                onPress={() => handleSettingPress(option)}
                activeOpacity={0.7}
                className={`flex-row items-center justify-between p-4 ${
                  index !== settingsOptions.length - 1
                    ? darkMode
                      ? "border-b border-gray-700"
                      : "border-b border-gray-200"
                    : ""
                }`}
              >
                <View className="flex-row items-center">
                  {/* Icon */}

                  <View
                    className="w-11 h-11 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: `${option.color}20`,
                    }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={option.color}
                    />
                  </View>

                  {/* Label */}

                  <Text
                    className={`ml-4 text-base font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
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

        {/* ================================================= */}
        {/* QUICK STATS */}
        {/* ================================================= */}

        <View className="px-5 mb-6">
          <Text
            className={`text-lg font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Quick Stats
          </Text>

          <View className="flex-row gap-3">
            {/* SAVED PLANS */}

            <View
              className="flex-1 rounded-2xl p-4"
              style={{
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(16,185,129,0.15)"
                    : "#dcfce7",
                }}
              >
                <Ionicons name="bookmark" size={24} color="#059669" />
              </View>

              <Text
                className={`text-2xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                12
              </Text>

              <Text
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Saved Plans
              </Text>
            </View>

            {/* SURVEYS TAKEN */}

            <View
              className="flex-1 rounded-2xl p-4"
              style={{
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(59,130,246,0.15)"
                    : "#dbeafe",
                }}
              >
                <Ionicons name="checkbox" size={24} color="#3b82f6" />
              </View>

              <Text
                className={`text-2xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                3
              </Text>

              <Text
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Surveys Taken
              </Text>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* LOGOUT */}
        {/* ================================================= */}

        <View className="px-5">
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.8}
            className="rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#ef4444",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={["#ef4444", "#dc2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#ffffff" />

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
