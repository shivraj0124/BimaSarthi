import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useApp } from "../../contexts/AppContext";
import { translations } from "../../localization/translation2";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
/* =========================
   STATIC IMAGES
========================= */
const fraudCallImg = require("../../assets/images/fraudClaim/call.png");
const fraudRealImg = require("../../assets/images/fraudClaim/real.png");
const fraudAlertImg = require("../../assets/images/fraudClaim/alert.png");
import * as Speech from "expo-speech";
/* =========================
   SCREEN
========================= */
export default function FraudSeBacheScreen() {
  const { darkMode, language } = useApp();
  const router = useRouter();

  const normalizeLanguage = (lang) => {
    if (!lang) return "en";
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("hi")) return "hi";
    if (lang.startsWith("mr")) return "mr";
    return "en";
  };

  const safeLanguage = normalizeLanguage(language);
  const t = translations[safeLanguage];
  const fraud = t?.fraud;

  // ✅ GUARD (prevents crash)
  if (!fraud) return null;
  const speakInfo = (text) => {
    Speech.speak(text, {
      language:
        language === "hi"
          ? "hi-IN"
          : language === "en"
            ? "en-US"
            : language === "mr"
              ? "mr-IN"
              : "en-US",

      pitch: 1,
      rate: 1,
    });
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* HEADER WITH GRADIENT */}
      <LinearGradient
        colors={darkMode ? ["#991b1b", "#7f1d1d"] : ["#ef4444", "#dc2626"]}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 mr-4 rounded-full bg-red-700 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="shield-checkmark" size={20} color="white" />
          </View>
          <Text className="ml-3 text-2xl font-bold text-white">
            {fraud.title}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* WARNING ALERT */}
        <View
          className="mb-6 rounded-3xl overflow-hidden"
          style={{
            shadowColor: "#ef4444",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={["#fee2e2", "#fecaca"]}
            style={{
              padding: 24,
            }}
          >
            {/* Alert Icon */}
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-red-500 items-center justify-center">
                <Ionicons name="alert-circle" size={28} color="white" />
              </View>
              <Text className="ml-4 text-2xl font-bold text-red-900 flex-1">
                {fraud.warningTitle}
              </Text>
            </View>

            {/* Image */}
            <View className="items-center my-4">
              <Image
                source={fraudAlertImg}
                style={{ width: 240, height: 160 }}
                resizeMode="contain"
              />
            </View>

            {/* Warning Text */}
            <Text className="text-lg text-red-800 leading-6 mb-4">
              {fraud.warningText}
            </Text>

            {/* Listen Button */}
            <TouchableOpacity
              className="rounded-2xl overflow-hidden"
              style={{
                shadowColor: "#7f1d1d",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => speakInfo(fraud.warningText)}
            >
              <LinearGradient
                colors={["#991b1b", "#7f1d1d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="volume-high" size={20} color="white" />
                <Text className="ml-2 text-white font-bold text-lg">
                  {fraud.listen}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* GOLDEN RULES */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-7 bg-green-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {fraud.rulesTitle}
            </Text>
          </View>

          {fraud.rules?.map((rule, index) => (
            <View
              key={index}
              className={`mb-3 rounded-3xl p-5 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="shield-checkmark" size={20} color="#059669" />
                </View>

                <Text
                  className={`ml-4 text-lg flex-1 leading-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {rule}
                </Text>

                <TouchableOpacity
                  className="ml-2"
                  onPress={() => speakInfo(rule)}
                >
                  <Ionicons
                    name="volume-medium"
                    size={20}
                    color={darkMode ? "#9ca3af" : "#6b7280"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* FAKE VS REAL COMPARISON */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-7 bg-orange-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {fraud.comparisonTitle}
            </Text>
          </View>

          {/* FAKE CARD */}
          <View
            className="mb-4 rounded-3xl overflow-hidden"
            style={{
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={["#fee2e2", "#fecaca"]}
              style={{
                padding: 24,
              }}
            >
              {/* Header */}
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 rounded-full bg-red-500 items-center justify-center">
                  <Ionicons name="close-circle" size={28} color="white" />
                </View>
                <Text className="ml-4 text-2xl font-bold text-red-900 flex-1">
                  {fraud.fake?.title}
                </Text>
              </View>

              {/* Image */}
              <View className="items-center my-4 bg-white/50 rounded-2xl p-4">
                <Image
                  source={fraudCallImg}
                  style={{ width: 220, height: 150 }}
                  resizeMode="contain"
                />
              </View>

              {/* Points */}
              <View>
                {fraud.fake?.points?.map((point, i) => (
                  <View key={i} className="flex-row items-start mb-3">
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color="#991b1b"
                      style={{ marginTop: 2 }}
                    />
                    <Text className="ml-3 text-red-900 text-lg flex-1 leading-6">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* REAL CARD */}
          <View
            className="mb-4 rounded-3xl overflow-hidden"
            style={{
              shadowColor: "#10b981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={["#d1fae5", "#a7f3d0"]}
              style={{
                padding: 24,
              }}
            >
              {/* Header */}
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 rounded-full bg-green-600 items-center justify-center">
                  <Ionicons name="checkmark-circle" size={28} color="white" />
                </View>
                <Text className="ml-4 text-2xl font-bold text-green-900 flex-1">
                  {fraud.real?.title}
                </Text>
              </View>

              {/* Image */}
              <View className="items-center my-4 bg-white/50 rounded-2xl p-4">
                <Image
                  source={fraudRealImg}
                  style={{ width: 220, height: 150 }}
                  resizeMode="contain"
                />
              </View>

              {/* Points */}
              <View>
                {fraud.real?.points?.map((point, i) => (
                  <View key={i} className="flex-row items-start mb-3">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#065f46"
                      style={{ marginTop: 2 }}
                    />
                    <Text className="ml-3 text-green-900 text-lg flex-1 leading-6">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* WHAT TO DO */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-7 bg-blue-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {fraud.whatToDoTitle}
            </Text>
          </View>

          <View
            className={`rounded-3xl p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {fraud.whatToDo?.map((item, i) => (
              <View key={i} className="flex-row items-start mb-4">
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="checkmark" size={18} color="#059669" />
                </View>
                <Text
                  className={`ml-4 text-lg flex-1 leading-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* TRUST SECTION */}
        <View
          className="rounded-3xl p-6 bg-green-50"
          style={{
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center">
              <Ionicons name="shield-checkmark" size={32} color="#059669" />
            </View>
          </View>
          {fraud.trust?.map((note, i) => (
            <View key={i} className="flex-row items-center justify-center mb-2">
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text className="ml-2 text-center text-green-800 text-lg font-medium">
                {note}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
