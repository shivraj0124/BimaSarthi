import React from "react";
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useApp } from "../../contexts/AppContext";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather,Ionicons } from '@expo/vector-icons';
import { t } from "../../localization/translate";
const { width } = Dimensions.get("window");
import * as Speech from 'expo-speech';
const LearnDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { darkMode, language } = useApp();

  const item = route?.params?.item;
  // console.log("Learn Item:", item);
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
  if (!item) {
    return (
      <SafeAreaView className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-white"}>
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="document-outline"
            size={64}
            color={darkMode ? "#9ca3af" : "#d1d5db"}
          />
          <Text className={`mt-4 text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No Data Found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-gray-50"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Media Section with Overlay */}
        <View className="relative">
          {item.contentType === "video" ? (
            <Video
              source={{ uri: item?.mediaUrl }}
              style={{ width: width, height: 280 }}
              useNativeControls
              resizeMode="contain"
              shouldPlay={false}
            />
          ) : (
            <Image
              source={{ uri: item.mediaUrl }}
              style={{ width: width, height: 280 }}
              resizeMode="cover"
            />
          )}

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(249, 250, 251, 0.8)']}
            className="absolute bottom-0 left-0 right-0 h-24"
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-4 rounded-full p-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#059669" />
          </TouchableOpacity>

          {/* Content Type Badge */}
          <View
            className="absolute top-4 right-4 rounded-full px-4 py-2"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.95)',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={item.contentType === "video" ? "play-circle" : "image"}
                size={16}
                color="white"
              />
              <Text className="ml-1 text-white font-semibold text-lg uppercase">
                {item.contentType}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          {/* Title */}
          <Text
            className={`text-3xl font-bold mt-6 mb-3 ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {item.title}
          </Text>

          {/* Meta Information Cards */}
          <View className="flex-row flex-wrap gap-3 mb-5">
            {/* Category */}
            <View
              className={`flex-row items-center rounded-xl px-4 py-3 ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Ionicons name="folder-outline" size={18} color="#10b981" />
              <Text className="ml-2 text-xl text-green-600 font-semibold">
                {
                  t(`${item.category}`, language)?.charAt(0).toUpperCase() +
                  t(`${item.category}`, language)?.slice(1)
                }

              </Text>
            </View>

            {/* Duration */}
            {item.duration && (
              <View
                className={`flex-row items-center rounded-xl px-4 py-3 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Ionicons name="time-outline" size={18} color="#10b981" />
                <Text className={`ml-2 text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {item.duration}
                </Text>
              </View>
            )}

            {/* Views */}
            {item.views !== undefined && (
              <View
                className={`flex-row items-center rounded-xl px-4 py-3 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Ionicons name="eye-outline" size={18} color="#10b981" />
                <Text className={`ml-2 text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {item.views.toLocaleString()} {t("views", language)}
                </Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-1 h-6 bg-green-500 rounded-full mr-2" />
                <Text className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {t("tags", language)}
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="rounded-full px-4 py-2"
                    style={{
                      backgroundColor: darkMode ? '#1f2937' : '#dcfce7',
                    }}
                  >
                    <Text
                      className="font-medium"
                      style={{ color: darkMode ? '#86efac' : '#059669' }}
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
            <View className="flex-row items-center mb-3">
              <View className="w-1 h-6 bg-green-500 rounded-full mr-2" />
              <Text className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {t("description", language)}
              </Text>
            </View>
            <View
              className={`rounded-2xl p-6 flex-col justify-start items-start ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text
                className={`text-xl leading-7 ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                {item.description}
              </Text>

              <TouchableOpacity onPress={() => speakInfo(item.description)} className=" p-1 w-max rounded-full bg-green-100">
                <Feather name="volume-2" size={24} color="#059669" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">

            <TouchableOpacity
              className="flex-1 rounded-2xl overflow-hidden"
              activeOpacity={0.8}
              style={{
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="bookmark-outline" size={20} color="white" />
                  <Text className="ml-2 text-white text-base font-bold">
                    {t("save", language)}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>


            <TouchableOpacity
              className="flex-1 rounded-2xl overflow-hidden"
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderWidth: 2,
                borderColor: '#10b981',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="py-4 items-center">
                <View className="flex-row items-center">
                  <Ionicons name="share-social-outline" size={20} color="#10b981" />
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