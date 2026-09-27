import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "../../contexts/AppContext";
import { translations } from "../../localization/translation2";
import { useRouter } from "expo-router";
/* =========================
   STATIC IMAGES
========================= */
const claimImg = require("../../assets/images/fraudClaim/claim.png");
const docsImg = require("../../assets/images/fraudClaim/document.png");
const claimIntroImg = require("../../assets/images/fraudClaim/claim_intro.png");
import * as Speech from "expo-speech";
/* =========================
   SCREEN
========================= */
export default function ClaimKaiseKareScreen() {
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
  const claim = t?.claim;

  if (!claim) return null;
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
      className={darkMode ? "flex-1 bg-gray-950 " : "flex-1 bg-white"}
    >
      {/* MODERN HEADER WITH GRADIENT */}
      <LinearGradient
        colors={darkMode ? ["#1f2937", "#111827"] : ["#10b981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 64,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 mr-4 rounded-full bg-green-700 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
          <Feather name="file-text" size={22} color="#fff" />
        </View>
        <Text className="ml-3 text-xl font-bold text-white">{claim.title}</Text>
      </LinearGradient>

      <ScrollView
        className="px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO INTRO CARD */}
        <View
          className={`rounded-3xl p-6 mb-8 shadow-xl ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <View className="flex-row items-center mb-4">
            <LinearGradient
              colors={["#10b981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="file-text" size={24} color="#fff" />
            </LinearGradient>
            <Text
              className={`ml-4 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {claim.introTitle}
            </Text>
          </View>

          <View className="bg-green-50 rounded-2xl p-4 mb-4">
            <Image
              source={claimIntroImg}
              className="w-full h-48"
              resizeMode="contain"
            />
          </View>

          <Text
            className={`text-lg leading-6 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            {claim.introText}
          </Text>

          <TouchableOpacity
            className="flex-row items-center bg-green-100 py-3 px-4 rounded-xl"
            onPress={() => speakInfo(claim.introText)}
          >
            <Feather name="volume-2" size={22} color="#059669" />
            <Text className="ml-3 text-base font-semibold text-green-700">
              {claim.listen}
            </Text>
          </TouchableOpacity>
        </View>

        {/* WHEN TO CLAIM SECTION */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-8 bg-green-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {claim.whenTitle}
            </Text>
          </View>

          <View className="space-y-3">
            {claim.situations?.map((item, index) => (
              <View
                key={index}
                className={`flex-row items-start mt-1 p-4 rounded-2xl shadow-sm justify-start items-center ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mt-0.5">
                  <Feather name="alert-circle" size={16} color="#059669" />
                </View>
                <Text
                  className={`ml-3 text-lg leading-6 flex-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* STEP BY STEP GUIDE */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-8 bg-green-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {claim.stepsTitle}
            </Text>
          </View>

          <View className=" from-green-50 to-emerald-50 rounded-2xl p-4 mb-5">
            <Image
              source={claimImg}
              className="w-full h-64 rounded-xl"
              resizeMode="contain"
            />
          </View>

          <View className="space-y-4">
            {claim.steps?.map((step, index) => (
              <View
                key={index}
                className={`flex-row mt-1 items-start p-5 rounded-2xl shadow-sm justify-start items-center ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                  }}
                >
                  <Text className="text-white text-base font-bold">
                    {index + 1}
                  </Text>
                </LinearGradient>

                <Text
                  className={`ml-4 text-lg leading-6 flex-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  {step}
                </Text>

                <TouchableOpacity
                  className="ml-2 mt-1"
                  onPress={() => speakInfo(step)}
                >
                  <Feather
                    name="volume-2"
                    size={20}
                    color={darkMode ? "#10b981" : "#059669"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* REQUIRED DOCUMENTS */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-8 bg-green-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {claim.docsTitle}
            </Text>
          </View>

          <View className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-5">
            <Image
              source={docsImg}
              className="w-full h-40 rounded-xl"
              resizeMode="contain"
            />
          </View>

          <View className="space-y-3">
            {claim.documents?.map((doc, index) => (
              <View
                key={index}
                className={`flex-row mt-1 items-start p-4 rounded-2xl shadow-sm ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center mt-0.5">
                  <Feather name="check" size={14} color="#fff" />
                </View>
                <Text
                  className={`ml-3 text-lg leading-6 flex-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  {doc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* WARNING CARD */}
        <View className="mb-8 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200 shadow-lg">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-2xl bg-amber-500 items-center justify-center">
              <Feather name="alert-triangle" size={24} color="#fff" />
            </View>
            <Text className="ml-4 text-lg font-bold text-amber-900">
              {claim.important}
            </Text>
          </View>

          <Text className="text-amber-800 text-base leading-6">
            {claim.warning}
          </Text>
        </View>

        {/* TRUST BADGES */}
        <View
          className={`rounded-2xl p-6 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-green-50"}`}
        >
          {claim.trust?.map((line, i) => (
            <View key={i} className="flex-row items-center mb-3">
              <View className="w-7 h-7 rounded-full bg-green-500 items-center justify-center">
                <Feather name="check" size={16} color="#fff" />
              </View>
              <Text
                className={`ml-3 text-lg font-medium ${darkMode ? "text-green-400" : "text-green-700"}`}
              >
                {line}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
