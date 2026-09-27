import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../../contexts/AppContext";

import { LinearGradient } from "expo-linear-gradient";

import axios from "axios";

import { useCallback, useEffect, useState } from "react";

import { VideoView, useVideoPlayer } from "expo-video";

import { t } from "../../localization/translate";

import * as Speech from "expo-speech";

const SPEECH_LOCALES = {
  hi: "hi-IN",
  en: "en-US",
  mr: "mr-IN",
};

function LearnVideo({ uri }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={{ width: "100%", height: 200 }}
      nativeControls
      contentFit="cover"
    />
  );
}

// Insurance Categories Data
const CATEGORIES = [
  { id: 1, name: "Health", icon: "heart", color: "#ef4444" },
  { id: 2, name: "Crop", icon: "cloud-rain", color: "#f59e0b" },
  { id: 3, name: "Life", icon: "shield", color: "#10b981" },
  { id: 4, name: "Accident", icon: "alert-triangle", color: "#3b82f6" },
];

const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 3,
};

/** Section title with the green accent bar, used above Featured/Learn/Quick Actions */
const SectionHeader = ({ label, darkMode }) => (
  <View className="flex-row items-center mb-4">
    <View className="w-1 h-7 bg-green-500 rounded-full mr-3" />
    <Text
      className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
    >
      {label}
    </Text>
  </View>
);

const QuickActionRow = ({
  icon,
  iconBg,
  iconColor,
  label,
  onPress,
  darkMode,
}) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    activeOpacity={0.75}
    className={`rounded-2xl p-5 flex-row items-center justify-between ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
    style={cardShadow}
  >
    <View className="flex-row items-center">
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <Text
        className={`ml-4 text-base font-semibold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {label}
      </Text>
    </View>
    <Feather
      name="chevron-right"
      size={20}
      color={darkMode ? "#9ca3af" : "#6b7280"}
    />
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { darkMode, language } = useApp();
  const router = useRouter();
  const username = "Raj";

  const [learnContent, setLearnContent] = useState([]);
  const [loadingLearn, setLoadingLearn] = useState(true);
  const [learnError, setLearnError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = useCallback(
    (text) => {
      if (!text) return;

      if (isSpeaking) {
        Speech.stop();
        setIsSpeaking(false);
        return;
      }

      Speech.speak(text, {
        language: SPEECH_LOCALES[language] || "en-US",
        pitch: 1,
        rate: 1,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    },
    [isSpeaking, language],
  );

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const fetchLearnContent = useCallback(async () => {
    try {
      setLearnError(false);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/learn?lang=${language}`,
      );

      if (response.data.success) {
        setLearnContent(response.data.data);
      } else {
        setLearnError(true);
      }
    } catch (error) {
      console.log("Learn API Error:", error.message);
      setLearnError(true);
    } finally {
      setLoadingLearn(false);
      setRefreshing(false);
    }
  }, [language]);

  useEffect(() => {
    setLoadingLearn(true);
    fetchLearnContent();
  }, [fetchLearnContent]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLearnContent();
  }, [fetchLearnContent]);

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#10b981"
            colors={["#10b981"]}
          />
        }
      >
        {/* Header with Gradient */}
        {/* <LinearGradient
          colors={darkMode ? ["#1f2937", "#111827"] : ["#10b981", "#059669"]}
          className="px-5 pt-6 pb-8"
        >
          <View className="flex-row items-center justify-between mb-6 ">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Feather name="shield" size={20} color="white" />
              </View>
              <Text className="ml-3 text-xl font-bold text-white">
                BimaSaarthi
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/profile")}
              accessibilityRole="button"
              accessibilityLabel={t("profile", language) || "Profile"}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Feather name="user" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold text-white mb-2 ">
            {t("greeting", language)}, {username}
          </Text>
          <Text className="text-white/90 text-base">
            {t("tagline", language)}
          </Text>
        </LinearGradient> */}
        <LinearGradient
          colors={darkMode ? ["#1f2937", "#111827"] : ["#10b981", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 28,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Feather name="shield" size={20} color="white" />
              </View>

              <Text className="ml-3 text-xl font-bold text-white">
                BimaSaarthi
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/profile")}
              accessibilityRole="button"
              accessibilityLabel={t("profile", language) || "Profile"}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Feather name="user" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Welcome Section */}
          <View>
            <Text className="text-2xl font-bold text-white mb-2">
              {t("greeting", language)}, {username}
            </Text>

            <Text className="text-white/90 text-base">
              {t("tagline", language)}
            </Text>
          </View>
        </LinearGradient>

        {/* Insurance Categories */}
        <View className="px-5 -mt-8 mb-6 ">
          <View
            className={`rounded-3xl p-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Text
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("insuranceCategories", language)}
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() =>
                    router.push({
                      pathname: "/insurance",
                      params: { category: category.name },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={t(category.name, language)}
                  activeOpacity={0.75}
                  className="flex-1 min-w-[45%] rounded-2xl p-4"
                  style={{ backgroundColor: darkMode ? "#374151" : "#f9fafb" }}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Feather
                      name={category.icon}
                      size={24}
                      color={category.color}
                    />
                  </View>
                  <Text
                    className={`text-base font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t(`${category.name}`, language)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Featured Scheme */}
        <View className="px-5 mb-6">
          <SectionHeader
            label={t("featuredSchemeTitle", language)}
            darkMode={darkMode}
          />

          {/* Info Banner */}
          <View
            className={`flex-row items-start mb-4 rounded-xl p-3 ${
              darkMode ? "bg-green-950/40" : "bg-green-50"
            }`}
          >
            <Feather
              name="info"
              size={18}
              color="#059669"
              style={{ marginTop: 2 }}
            />
            <Text
              className={`ml-2 text-sm flex-1 ${
                darkMode ? "text-green-300" : "text-green-700"
              }`}
            >
              {t("infoNote", language)}
            </Text>

            <TouchableOpacity
              onPress={() => toggleSpeech(t("infoNote", language))}
              accessibilityRole="button"
              accessibilityLabel={
                isSpeaking
                  ? t("stop", language) || "Stop"
                  : t("listen", language) || "Listen"
              }
              className="ml-2 p-1.5 rounded-full"
              style={{ backgroundColor: darkMode ? "#064e3b55" : "#d1fae5" }}
            >
              <Feather
                name={isSpeaking ? "pause" : "volume-2"}
                size={18}
                color="#059669"
              />
            </TouchableOpacity>
          </View>

          {/* Featured Card */}
          <View
            className={`rounded-3xl overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Image
              source={require("../../assets/images/new/26675.jpg")}
              className="w-full h-64"
              resizeMode="cover"
            />

            <View className="p-5">
              <Text
                className={`text-2xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("schemeName", language)}
              </Text>

              <Text
                className={`text-base mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("schemeDescription", language)}
              </Text>

              {/* Benefits Tags */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {t("benefits", language).map((item, index) => (
                  <View
                    key={index}
                    className={`flex-row items-center px-3 py-2 rounded-full ${
                      darkMode ? "bg-green-950/40" : "bg-green-50"
                    }`}
                  >
                    <Feather name="check-circle" size={14} color="#059669" />
                    <Text
                      className={`ml-1 text-sm font-medium ${
                        darkMode ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Trust Indicators */}
              <View
                className={`border-t pt-4 flex-row flex-wrap gap-3 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {t("trustPoints", language).map((item, index) => (
                  <View key={index} className="flex-row items-center">
                    <Feather name="check" size={14} color="#059669" />
                    <Text
                      className={`ml-1 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                onPress={() => router.push("/insurance")}
                activeOpacity={0.85}
                className="mt-4 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text className="text-white text-base font-bold">
                    {t("learnMore", language)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Learn Section */}
        <View className="px-5 mb-6">
          <SectionHeader
            label={t("learnBasics", language)}
            darkMode={darkMode}
          />

          {loadingLearn ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" color="#10b981" />
            </View>
          ) : learnError ? (
            <View
              className={`rounded-2xl p-6 items-center ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              style={cardShadow}
            >
              <Feather
                name="wifi-off"
                size={28}
                color={darkMode ? "#6b7280" : "#9ca3af"}
              />
              <Text
                className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {t("learnLoadError", language) || "Couldn't load content"}
              </Text>
              <TouchableOpacity
                onPress={fetchLearnContent}
                className="mt-3 px-4 py-2 rounded-full bg-green-600"
              >
                <Text className="text-white text-sm font-semibold">
                  {t("retry", language) || "Retry"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : learnContent.length === 0 ? (
            <View
              className={`rounded-2xl p-6 items-center ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              style={cardShadow}
            >
              <Feather
                name="book-open"
                size={28}
                color={darkMode ? "#6b7280" : "#9ca3af"}
              />
              <Text
                className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {t("noLearnContent", language) || "Nothing here yet"}
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {learnContent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push({
                      pathname: "/LearnDetail",
                      params: { item: JSON.stringify(item) },
                    })
                  }
                  activeOpacity={0.85}
                  className="rounded-3xl mr-4 overflow-hidden"
                  style={{
                    width: 280,
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    ...cardShadow,
                  }}
                >
                  {/* Media with Overlay */}
                  <View className="relative">
                    {item.contentType === "video" ? (
                      <LearnVideo uri={item.mediaUrl} />
                    ) : (
                      <Image
                        source={{ uri: item.mediaUrl }}
                        style={{ width: "100%", height: 200 }}
                        resizeMode="cover"
                      />
                    )}

                    <LinearGradient
                      colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
                      className="absolute bottom-0 left-0 right-0 h-20"
                      pointerEvents="none"
                    />

                    {/* Content Type Badge */}
                    <View
                      className="absolute top-3 right-3 rounded-full px-3 py-1.5 flex-row items-center"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.95)" }}
                    >
                      <Ionicons
                        name={item.contentType === "video" ? "play" : "image"}
                        size={12}
                        color="white"
                      />
                      <Text className="ml-1 text-white font-semibold text-xs uppercase">
                        {t(`${item.contentType}`, language)}
                      </Text>
                    </View>

                    {/* Duration Badge */}
                    {item.contentType === "video" && item.duration && (
                      <View
                        className="absolute bottom-3 left-3 rounded-lg px-2 py-1 flex-row items-center"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                      >
                        <Ionicons name="time-outline" size={12} color="white" />
                        <Text className="ml-1 text-white font-medium text-xs">
                          {item.duration}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <View className="p-4">
                    <Text
                      numberOfLines={2}
                      className={`text-lg font-bold leading-6 mb-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </Text>

                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      className={`text-sm leading-5 mb-4 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </Text>

                    <View className="flex-row items-center justify-between">
                      {item.category && (
                        <View className="flex-row items-center">
                          <Ionicons
                            name="folder-outline"
                            size={14}
                            color="#10b981"
                          />
                          <Text className="ml-1 text-green-600 text-sm font-medium">
                            {t(`${item.category}`, language)}
                          </Text>
                        </View>
                      )}

                      {item.views !== undefined && (
                        <View className="flex-row items-center">
                          <Ionicons
                            name="eye-outline"
                            size={14}
                            color="#9ca3af"
                          />
                          <Text
                            className={`ml-1 text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {item.views >= 1000
                              ? `${(item.views / 1000).toFixed(1)}k`
                              : item.views}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <SectionHeader
            label={t("quickActions", language)}
            darkMode={darkMode}
          />

          <View className="gap-3">
            <QuickActionRow
              icon="search"
              iconBg={darkMode ? "#065f4633" : "#d1fae5"}
              iconColor="#059669"
              label={t("findInsurance", language)}
              onPress={() => router.push("/insurance")}
              darkMode={darkMode}
            />

            <QuickActionRow
              icon="phone"
              iconBg={darkMode ? "#1e3a8a33" : "#dbeafe"}
              iconColor="#3b82f6"
              label={t("helpSupport", language)}
              onPress={() => router.push("/support")}
              darkMode={darkMode}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
