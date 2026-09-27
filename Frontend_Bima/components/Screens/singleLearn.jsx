import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApp } from "../../contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { t } from "../../localization/translate";
import * as Speech from "expo-speech";

const { width } = Dimensions.get("window");
const MEDIA_HEIGHT = 300;

const SPEECH_LOCALES = {
  hi: "hi-IN",
  en: "en-US",
  mr: "mr-IN",
};

/**
 * Video player for expo-video.
 * useVideoPlayer is a hook, so it must live in its own component.
 */
const LearnVideo = ({ uri }) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={{ width, height: MEDIA_HEIGHT }}
      nativeControls
      contentFit="contain"
    />
  );
};

/**
 * Image with a loading spinner + graceful fallback if it fails to load.
 */
const LearnImage = ({ uri, darkMode }) => {
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  if (!uri || status === "error") {
    return (
      <View
        style={{ width, height: MEDIA_HEIGHT }}
        className={`items-center justify-center ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <Ionicons
          name="image-outline"
          size={48}
          color={darkMode ? "#4b5563" : "#d1d5db"}
        />
      </View>
    );
  }

  return (
    <View style={{ width, height: MEDIA_HEIGHT }}>
      <Image
        source={{ uri }}
        style={{ width, height: MEDIA_HEIGHT }}
        resizeMode="cover"
        onLoadEnd={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {status === "loading" && (
        <View
          className={`absolute inset-0 items-center justify-center ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <ActivityIndicator color="#10b981" />
        </View>
      )}
    </View>
  );
};

const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

const MetaChip = ({ icon, label, darkMode }) => (
  <View
    className={`flex-row items-center rounded-xl px-4 py-3 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
    style={cardShadow}
  >
    {icon}
    <Text
      className={`ml-2 text-base font-medium ${
        darkMode ? "text-gray-200" : "text-gray-700"
      }`}
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

/** Section title with the little green accent bar, used above Tags/Description */
const SectionHeader = ({ label, darkMode }) => (
  <View className="flex-row items-center mb-3">
    <View className="w-1 h-6 bg-green-500 rounded-full mr-2" />
    <Text
      className={`text-xl font-semibold ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {label}
    </Text>
  </View>
);

const LearnDetail = () => {
  const router = useRouter();
  const { darkMode, language } = useApp();
  const { item: routeItem } = useLocalSearchParams();

  const [isSaved, setIsSaved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const item = useMemo(() => {
    if (!routeItem) return null;
    try {
      return typeof routeItem === "string" ? JSON.parse(routeItem) : routeItem;
    } catch (error) {
      console.log("Failed to parse learn item:", error);
      return null;
    }
  }, [routeItem]);

  // Stop any in-flight speech when the screen unmounts.
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

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

  const handleSave = useCallback(() => {
    // Optimistic local toggle. Wire this up to your persistence layer
    // (e.g. useApp().toggleSavedItem(item.id)) when that's available.
    setIsSaved((prev) => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    if (!item) return;
    try {
      await Share.share({
        title: item.title,
        message: item.mediaUrl ? `${item.title}\n${item.mediaUrl}` : item.title,
      });
    } catch (error) {
      console.log("Share failed:", error);
    }
  }, [item]);

  if (!item) {
    return (
      <SafeAreaView
        className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-white"}
      >
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons
            name="document-outline"
            size={64}
            color={darkMode ? "#4b5563" : "#d1d5db"}
          />
          <Text
            className={`mt-4 text-lg font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t("noDataFound", language) || "No Data Found"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 rounded-full px-6 py-3 bg-green-600"
          >
            <Text className="text-white font-semibold">
              {t("goBack", language) || "Go Back"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const translatedCategory =
    t(`${item.category}`, language) || item.category || "";
  const displayCategory =
    translatedCategory.charAt(0).toUpperCase() + translatedCategory.slice(1);

  return (
    <SafeAreaView
      edges={["top"]}
      className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-gray-50"}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Media Section */}
        <View className="relative">
          {item.contentType === "video" ? (
            <LearnVideo uri={item?.mediaUrl} />
          ) : (
            <LearnImage uri={item?.mediaUrl} darkMode={darkMode} />
          )}

          {/* Gradient overlay so the content underneath reads cleanly */}
          <LinearGradient
            colors={[
              "transparent",
              darkMode ? "rgba(17, 24, 39, 0.9)" : "rgba(249, 250, 251, 0.9)",
            ]}
            className="absolute bottom-0 left-0 right-0 h-20"
            pointerEvents="none"
          />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("goBack", language) || "Go back"}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="absolute top-4 left-4 rounded-full p-2.5"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#059669" />
          </TouchableOpacity>

          {/* Content type badge */}
          <View
            className="absolute top-4 right-4 rounded-full px-3.5 py-2 flex-row items-center"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.95)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons
              name={item.contentType === "video" ? "play-circle" : "image"}
              size={15}
              color="white"
            />
            <Text className="ml-1.5 text-white font-semibold text-xs tracking-wide uppercase">
              {item.contentType}
            </Text>
          </View>
        </View>

        <View className="px-5">
          {/* Title */}
          <Text
            className={`text-2xl font-bold mt-5 mb-3 leading-8 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {item.title}
          </Text>

          {/* Meta chips */}
          <View className="flex-row flex-wrap gap-3 mb-5">
            <MetaChip
              icon={
                <Ionicons name="folder-outline" size={17} color="#10b981" />
              }
              label={displayCategory}
              darkMode={darkMode}
            />

            {item.duration && (
              <MetaChip
                icon={
                  <Ionicons name="time-outline" size={17} color="#10b981" />
                }
                label={item.duration}
                darkMode={darkMode}
              />
            )}

            {item.views !== undefined && (
              <MetaChip
                icon={<Ionicons name="eye-outline" size={17} color="#10b981" />}
                label={`${item.views.toLocaleString()} ${t("views", language)}`}
                darkMode={darkMode}
              />
            )}
          </View>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <View className="mb-6">
              <SectionHeader label={t("tags", language)} darkMode={darkMode} />
              <View className="flex-row flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <View
                    key={`${tag}-${index}`}
                    className="rounded-full px-4 py-2"
                    style={{
                      backgroundColor: darkMode ? "#1f2937" : "#dcfce7",
                    }}
                  >
                    <Text
                      className="font-medium text-sm"
                      style={{ color: darkMode ? "#86efac" : "#059669" }}
                    >
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View className="mb-6">
            <SectionHeader
              label={t("description", language)}
              darkMode={darkMode}
            />

            <View
              className={`rounded-2xl p-5 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              style={cardShadow}
            >
              <Text
                className={`text-base leading-6 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {item.description}
              </Text>

              <TouchableOpacity
                onPress={() => toggleSpeech(item.description)}
                accessibilityRole="button"
                accessibilityLabel={
                  isSpeaking
                    ? t("stop", language) || "Stop reading"
                    : t("listen", language) || "Listen"
                }
                className="flex-row items-center self-start mt-4 px-3 py-2 rounded-full"
                style={{
                  backgroundColor: darkMode ? "#064e3b33" : "#d1fae5",
                }}
              >
                <Feather
                  name={isSpeaking ? "pause" : "volume-2"}
                  size={18}
                  color="#059669"
                />
                <Text className="ml-2 text-sm font-semibold text-emerald-600">
                  {isSpeaking
                    ? t("stop", language) || "Stop"
                    : t("listen", language) || "Listen"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3">
            {/* Save */}
            <TouchableOpacity
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel={
                isSaved
                  ? t("saved", language) || "Saved"
                  : t("save", language) || "Save"
              }
              className="flex-1 rounded-2xl overflow-hidden"
              activeOpacity={0.85}
              style={{
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <LinearGradient
                colors={
                  isSaved ? ["#059669", "#047857"] : ["#10b981", "#059669"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 15,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={isSaved ? "bookmark" : "bookmark-outline"}
                    size={19}
                    color="white"
                  />
                  <Text className="ml-2 text-white text-base font-bold">
                    {isSaved
                      ? t("saved", language) || "Saved"
                      : t("save", language) || "Save"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel={t("share", language) || "Share"}
              className="flex-1 rounded-2xl overflow-hidden"
              activeOpacity={0.85}
              style={{
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                borderWidth: 2,
                borderColor: "#10b981",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="py-3.5 items-center">
                <View className="flex-row items-center">
                  <Ionicons
                    name="share-social-outline"
                    size={19}
                    color="#10b981"
                  />
                  <Text className="ml-2 text-green-600 text-base font-bold">
                    {t("share", language)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnDetail;
