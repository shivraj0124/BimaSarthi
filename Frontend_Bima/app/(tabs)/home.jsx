import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../contexts/AppContext";
import { LinearGradient } from 'expo-linear-gradient';
import axios from "axios";
import { useEffect, useState } from "react";
import { Video } from "expo-av";
import { t } from "../../localization/translate";
import * as Speech from 'expo-speech';

export default function HomeScreen() {
  const { darkMode, language } = useApp();
  const navigation = useNavigation();
  const username = "Raj";
  const [learnContent, setLearnContent] = useState([]);
  const [loadingLearn, setLoadingLearn] = useState(true);

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

  // Insurance Categories Data
  const categories = [
    { id: 1, name: "Health", icon: "heart", color: "#ef4444" },
    { id: 2, name: "Crop", icon: "cloud-rain", color: "#f59e0b" },
    { id: 3, name: "Life", icon: "shield", color: "#10b981" },
    { id: 4, name: "Accident", icon: "alert-triangle", color: "#3b82f6" },
  ];
  const fetchLearnContent = async () => {
    try {
      setLoadingLearn(true);

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/learn?lang=${language}`
      );

      if (response.data.success) {
        setLearnContent(response.data.data);
      }
    } catch (error) {
      // console.log("Learn API Error:", error.message);
    } finally {
      setLoadingLearn(false);
    }
  };

  useEffect(() => {
    fetchLearnContent();
  }, [language]);

  // Learn Content Data
  const learnContent2 = [
    {
      id: 1,
      title: "What is Insurance?",
      description: "Learn the basics in simple words",
      image: require("../../assets/images/basics/image.png"),
      icon: "play-circle",
      action: "Watch Video"
    },
    {
      id: 2,
      title: "How Insurance Works",
      description: "Understand premiums and claims",
      image: require("../../assets/images/basics/image2.png"),
      icon: "book-open",
      action: "Read More"
    },
    {
      id: 3,
      title: "Government Schemes",
      description: "Schemes for farmers & families",
      image: require("../../assets/images/image.png"),
      icon: "info",
      action: "Learn More"
    },
  ];

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={darkMode ? ['#1f2937', '#111827'] : ['#10b981', '#059669']}
          className="px-5 pt-6 pb-8"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Feather name="shield" size={20} color="white" />
              </View>
              <Text className="ml-3 text-xl font-bold text-white">
                BimaSaarthi
              </Text>
            </View>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Feather name="user" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Welcome Section */}
          <Text className="text-3xl font-bold text-white mb-2">
            {t("greeting", language)}, {username}
          </Text>
          <Text className="text-white/90 text-lg">
            {t("tagline", language)}
          </Text>
        </LinearGradient>

        {/* Insurance Categories */}
        <View className="px-5 -mt-6 mb-6">
          <View
            className={`rounded-3xl p-5 ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Text
              className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"
                }`}
            >
              {t("insuranceCategories", language)}
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="flex-1 min-w-[45%] rounded-2xl p-4"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  }}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Feather name={category.icon} size={24} color={category.color} />
                  </View>
                  <Text
                    className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"
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
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                }`}
            >
              {t("featuredSchemeTitle", language)}
            </Text>
          </View>

          {/* Info Banner */}
          {/* <View className="flex-row items-start mb-4 bg-green-50 rounded-xl p-3">
            <Feather name="info" size={18} color="#059669" className="mt-0.5" />
            <Text className="ml-2 text-green-700 text-md flex-1">
              {t("infoNote", language)}
            </Text>
          </View> */}

          {/* Info Banner */}
          <View className="flex-row items-start mb-4 bg-green-50 rounded-xl p-3">

            <Feather name="info" size={18} color="#059669" className="mt-0.5" />

            <Text className="ml-2 text-green-700 text-md flex-1">
              {t("infoNote", language)}
            </Text>

            {/* Speaker Button */}
            <TouchableOpacity onPress={()=>speakInfo(t("infoNote", language))} className="ml-2 p-1 rounded-full bg-green-100">
              <Feather name="volume-2" size={20} color="#059669" />
            </TouchableOpacity>

          </View>


          {/* Featured Card */}
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
            <Image
              source={require("../../assets/images/new/26675.jpg")}
              className="w-full h-64"
              resizeMode="cover"
            />

            <View className="p-5">
              <Text
                className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                {t("schemeName", language)}
              </Text>

              <Text
                className={`text-base mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                {t("schemeDescription", language)}
              </Text>
              

              {/* Benefits Tags */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {t("benefits", language).map(
                  (item, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-green-50 px-3 py-2 rounded-full"
                    >
                      <Feather name="check-circle" size={14} color="#059669" />
                      <Text className="ml-1 text-green-700 text-md font-medium">
                        {item}
                      </Text>
                    </View>
                  )
                )}
              </View>

              {/* Trust Indicators */}
              <View className="border-t border-gray-200 pt-4 flex-row flex-wrap gap-3">
                {t("trustPoints", language).map((item, index) => (
                  <View key={index} className="flex-row items-center">
                    <Feather name="check" size={14} color="#059669" />
                    <Text className="ml-1 text-gray-600 text-md">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <TouchableOpacity onPress={() => navigation.navigate("insurance")} className="mt-4 rounded-2xl overflow-hidden">
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 items-center"
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
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-7 bg-green-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                }`}
            >
              {t("learnBasics", language)}
            </Text>
          </View>

          {loadingLearn ? (
            <ActivityIndicator size="small" color="#10b981" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {learnContent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="rounded-3xl mr-4 overflow-hidden"
                  style={{
                    width: 280,
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",

                  }}
                >
                  {/* Media with Overlay */}
                  <View className="relative">
                    {item.contentType === "video" ? (
                      <Video
                        source={{ uri: item.mediaUrl }}
                        style={{ width: "100%", height: 200 }}
                        useNativeControls
                        resizeMode="cover"
                        shouldPlay={false}
                      />
                    ) : (
                      <Image
                        source={{ uri: item.mediaUrl }}
                        style={{ width: "100%", height: 200 }}
                        resizeMode="cover"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <LinearGradient
                      colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
                      className="absolute bottom-0 left-0 right-0 h-20"
                    />

                    {/* Content Type Badge */}
                    <View className="absolute top-3 right-3">
                      <View
                        className="rounded-full px-3 py-1.5 flex-row items-center"
                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.95)' }}
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
                    </View>

                    {/* Duration Badge (for videos) */}
                    {item.contentType === "video" && item.duration && (
                      <View className="absolute bottom-3 left-3">
                        <View
                          className="rounded-lg px-2 py-1 flex-row items-center"
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                        >
                          <Ionicons name="time-outline" size={12} color="white" />
                          <Text className="ml-1 text-white font-medium text-xs">
                            {item.duration}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <TouchableOpacity onPress={() => navigation.navigate("LearnDetail", { item })} className="p-4">
                    {/* Title */}
                    <Text
                      numberOfLines={2}
                      className={`text-xl font-bold leading-6 mb-2 ${darkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      {item.title}
                    </Text>

                    {/* Description */}
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      className={`text-lg leading-5 mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      {item.description}
                    </Text>

                    {/* Meta Info Row */}
                    <View className="flex-row items-center justify-between">
                      {/* Category */}
                      {item.category && (
                        <View className="flex-row items-center">
                          <Ionicons name="folder-outline" size={14} color="#10b981" />
                          <Text className="ml-1 text-green-600 text-md font-medium">
                            {t(`${item.category}`, language)}
                          </Text>
                        </View>
                      )}

                      {/* Views */}
                      {item.views !== undefined && (
                        <View className="flex-row items-center">
                          <Ionicons name="eye-outline" size={14} color="#9ca3af" />
                          <Text className={`ml-1 text-md ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
                          </Text>
                        </View>
                      )}
                    </View>

                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}


        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-7 bg-green-500 rounded-full mr-3" />
            <Text
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                }`}
            >
              {t("quickActions", language)}
            </Text>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              className={`rounded-2xl p-5 flex-row items-center justify-between ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => navigation.navigate("insurance")}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                  <Feather name="search" size={20} color="#059669" />
                </View>
                <Text
                  className={`ml-4 text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {t("findInsurance", language)}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className={`rounded-2xl p-5 flex-row items-center justify-between ${darkMode ? "bg-gray-800" : "bg-white"
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
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                  <Feather name="phone" size={20} color="#3b82f6" />
                </View>
                <Text
                  className={`ml-4 text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {t("helpSupport", language)}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={darkMode ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}