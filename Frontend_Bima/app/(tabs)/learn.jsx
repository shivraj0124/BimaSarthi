import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useApp } from "../../contexts/AppContext";
import { t } from "../../localization/translate";
import { Video } from "expo-av";
import { LinearGradient } from 'expo-linear-gradient';

const LearnScreen = () => {
  const { darkMode, language } = useApp();
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [learnData, setLearnData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories with icons
  const categories = [
    { id: "ALL", name: t("All",language), icon: "grid-outline" },
    { id: "basics", name: t("basics",language), icon: "book-outline" },
    { id: "claim", name: t("claim",language), icon: "document-text-outline" },
    { id: "fraud", name: t("fraud",language), icon: "shield-checkmark-outline" },
    { id: "Government", name: t("Government",language), icon: "business-outline" },
    { id: "Private", name: t("Private",language), icon: "briefcase-outline" },
  ];
  const handleCategoryPress = (categoryId) => {
    // if(categoryId === "fraud"){
    //   navigation.navigate("FraudSc")
    // }else if(categoryId === "claim"){
    //   navigation.navigate("ClaimSc")
    // }
    setSelectedCategory(categoryId);
  }
  useEffect(() => {
    fetchLearnData();
  }, [language]);

  const fetchLearnData = async () => {
    try {
      setLoading(true);
      // console.log("Fetching learn data for language:", language);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/learn?lang=${language}`
      );

      if (response.data.success) {
        setLearnData(response.data.data);
      }
      // console.log("Learn Data Fetched:", response.data.data.length, "items");
    } catch (error) {
      // console.log("Learn Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = learnData.filter((item) => {
    // console.log("Filtering item:", item.category);

    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={darkMode ? ['#1f2937', '#111827'] : ['#10b981', '#059669']}
        className="px-5 pt-6 pb-4"
      >
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Feather name="book-open" size={20} color="white" />
          </View>
          <Text className="ml-3 text-2xl font-bold text-white">
            {t("learnInsurance", language)}
          </Text>
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center rounded-2xl px-4 py-3"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Feather 
            name="search" 
            size={20} 
            color={darkMode ? "#9ca3af" : "#059669"} 
          />

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={t("searchTopics", language)}
            placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
            className={`ml-3 flex-1 text-base ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={darkMode ? "#9ca3af" : "#6b7280"} 
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Category Filter */}
        <View className="px-5 py-4">
          <Text
            className={`text-xl font-bold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("filterByCategory", language)}
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategoryPress(category.id)}
                  className={`rounded-2xl px-5 py-3 flex-row items-center ${
                    isSelected
                      ? ""
                      : darkMode
                      ? "bg-gray-800"
                      : "bg-white"
                  }`}
                  style={
                    isSelected
                      ? {
                          shadowColor: "#10b981",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 3,
                        }
                      : {
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 1,
                        }
                  }
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                    />
                  ) : null}
                  
                  <Ionicons
                    name={category.icon}
                    size={18}
                    color={
                      isSelected
                        ? "#ffffff"
                        : darkMode
                        ? "#9ca3af"
                        : "#059669"
                    }
                  />
                  <Text
                    className={`ml-2 font-semibold rounded-2xl ${
                      isSelected
                        ? "text-white"
                        : darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results Count */}
        {!loading && (
          <View className="px-5 mb-4">
            <Text
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {filteredData.length} {t("resultsFound", language)}
            </Text>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View className="py-20">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        )}

        {/* Cards */}
        <View className="px-5">
          {!loading &&
            filteredData.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.navigate("LearnDetail", { item })}
                className="rounded-3xl mb-5 overflow-hidden"
                style={{
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                {/* Media with Overlay */}
                <View className="relative">
                  {item.contentType === "video" ? (
                    <Video
                      source={{ uri: item.mediaUrl }}
                      style={{ width: "100%", height: 220 }}
                      useNativeControls
                      resizeMode="cover"
                      shouldPlay={false}
                    />
                  ) : (
                    <Image
                      source={{ uri: item.mediaUrl }}
                      style={{ width: "100%", height: 220 }}
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
                        {item.contentType}
                      </Text>
                    </View>
                  </View>

                  {/* Duration Badge (for videos)
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
                  )} */}
                </View>

                {/* Content */}
                <View className="p-5">
                  {/* Category Tag */}
                  {item.category && (
                    <View className="flex-row items-center mb-2">
                      <View
                        className="rounded-full px-2 py-1"
                        style={{ backgroundColor: darkMode ? '#374151' : '#dcfce7' }}
                      >
                        <Text
                          className="text-md font-medium"
                          style={{ color: darkMode ? '#86efac' : '#059669' }}
                        >
                          {t(`${item.category}`,language)}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Title */}
                  <Text
                    numberOfLines={2}
                    className={`text-2xl font-bold leading-7 mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </Text>

                  {/* Description */}
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className={`text-xl leading-6 mb-4 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </Text>

                  {/* Meta Info Row */}
                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    {/* Views */}
                    {item.views !== undefined && (
                      <View className="flex-row items-center">
                        <Ionicons name="eye-outline" size={16} color="#9ca3af" />
                        <Text
                          className={`ml-1 text-lg ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {item.views >= 1000
                            ? `${(item.views / 1000).toFixed(1)}k`
                            : item.views}{" "}
                          {t("views", language)}
                        </Text>
                      </View>
                    )}

                    {/* Read More */}
                    <View className="flex-row items-center">
                      <Text className="text-green-600 font-semibold text-lg">
                        {t("learnMore",language)}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#10b981"
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Empty State */}
        {!loading && filteredData.length === 0 && (
          <View className="items-center justify-center py-20">
            <Ionicons
              name="search-outline"
              size={64}
              color={darkMode ? "#4b5563" : "#d1d5db"}
            />
            <Text
              className={`text-lg font-medium mt-4 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No learning content found
            </Text>
            <Text
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnScreen;