import React, { useState, useEffect } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../contexts/AppContext";
import { t } from "../../localization/translate";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
const InsuranceScreen = () => {
  const { darkMode, language } = useApp();
  const navigation = useNavigation();

  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Category filters with icons
  const filters = [
    { id: "ALL", name: t("All", language), icon: "grid-outline" },
    { id: "Government", name: t("Government", language), icon: "business-outline" },
    { id: "Private", name: t("Private", language), icon: "briefcase-outline" },
  ];
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
  // Insurance type icons mapping
  const typeIcons = {
    Health: "heart-outline",
    Life: "shield-checkmark-outline",
    Crop: "leaf-outline",
    Accident: "ellipsis-horizontal-circle-outline",
    Other: "ellipsis-horizontal-circle-outline",
  };

  const fetchInsurancePlans = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/insurance`,
        {
          params: {
            category:
              selectedFilter !== "ALL" ? selectedFilter : undefined,
            search: searchText || undefined,
            lang: language,
          },
        }
      );

      if (response.data.success) {
        setInsurancePlans(response.data.data);
        console.log("Fetched insurance plans:", response.data.data);
      }
    } catch (error) {
      console.log(
        "Error fetching insurance:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch on filter or language change
  useEffect(() => {
    fetchInsurancePlans();
  }, [selectedFilter, language]);

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchInsurancePlans();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  const renderSection = (title) => {
    const plans = insurancePlans.filter((plan) => plan.type === title);

    if (plans.length === 0) return null;

    return (
      <View className="mb-8">
        {/* Section Header */}
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
            <Ionicons name={typeIcons[title]} size={22} color="#059669" />
          </View>
          <Text
            className={`ml-3 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {t(`${title}`, language)} {t(`insurance`, language)}
          </Text>
        </View>

        {/* Plans Grid */}
        {plans.map((plan, index) => (
          <TouchableOpacity
            key={plan._id || index}
            onPress={() => navigation.navigate("InsuranceDetails", { plan })}
            className="rounded-3xl mb-4 overflow-hidden"
            style={{
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* Image with Gradient Overlay */}
            <View className="relative">
              <Image
                source={{
                  uri:
                    plan.imageUrl ||
                    "https://www.pngplay.com/wp-content/uploads/7/Insurance-Transparent-Images.png",
                }}
                className="w-full h-48"
                resizeMode="cover"
              />

              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                className="absolute bottom-0 left-0 right-0 h-24"
              />

              {/* Category Badge */}
              <View className="absolute top-3 right-3">
                <View
                  className="rounded-full px-3 py-1.5 flex-row items-center"
                  style={{
                    backgroundColor:
                      plan.category === "Government"
                        ? "rgba(16, 185, 129, 0.95)"
                        : "rgba(59, 130, 246, 0.95)",
                  }}
                >
                  <Ionicons
                    name={
                      plan.category === "Government"
                        ? "shield-checkmark"
                        : "briefcase"
                    }
                    size={12}
                    color="white"
                  />
                  <Text className="ml-1 text-white font-semibold text-xs uppercase">
                    {t(plan.category, language)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Content */}
            <View className="p-5">
              {/* Plan Name */}
              <View className="flex-col justify-start items-start">
                <Text
                  className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {plan.name}
                </Text>
                <TouchableOpacity onPress={() => speakInfo(plan.name)} className="ml-2 p-1 w-max rounded-full bg-green-100">
                  <Feather name="volume-2" size={24} color="#059669" />
                </TouchableOpacity>
              </View>

              {/* Short Description */}
              <Text
                numberOfLines={2}
                className={`text-lg leading-6 mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                {plan.shortDescription}
              </Text>

              {/* Info Row */}
              <View className="flex-row items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Premium */}
                {plan.premium && (
                  <View className="flex-row items-center">
                    <Ionicons name="cash-outline" size={16} color="#10b981" />
                    <Text className="ml-1 text-green-600 font-semibold text-sm">
                      {/* {plan.premium} */}
                    </Text>
                  </View>
                )}

                {/* View Details */}
                <View className="flex-row items-center">
                  <Text className="text-green-600 font-semibold text-lg">
                    {t("viewDetails", language)}
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
    );
  };

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
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Feather name="shield" size={20} color="white" />
            </View>
            <Text className="ml-3 text-2xl font-bold text-white">
              {t("insurance", language)}
            </Text>
          </View>

          {/* Take Survey Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate("survey")}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor: 'hsla(107, 87%, 51%, 0.35)',
            }}
          >
            <View className="flex-row items-center">
              <Feather name="edit" size={16} color="white" />
              <Text className="ml-2 text-white font-semibold text-lg">
                Survey
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center rounded-2xl px-4 py-3"
          style={{
            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.95)",
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
            placeholder={t("searchInsurancePlans", language)}
            placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
            className={`ml-3 flex-1 text-base ${darkMode ? "text-white" : "text-gray-900"
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
        {/* Filters */}
        <View className="px-5 py-4">
          <Text
            className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {t("filterByCategory", language)}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {filters.map((filter) => {
              const isSelected = selectedFilter === filter.id;
              return (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                  className={`rounded-2xl w-max px-5 py-3 flex-row items-center ${isSelected ? "" : darkMode ? "bg-gray-800" : "bg-white"
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
                      colors={["#10b981", "#059669"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                    />
                  ) : null}

                  <Ionicons
                    name={filter.icon}
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
                    className={`ml-2 font-semibold ${isSelected
                      ? "text-white"
                      : darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                      }`}
                  >
                    {filter.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results Count */}
        {!loading && insurancePlans.length > 0 && (
          <View className="px-5 mb-4">
            <Text
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              {insurancePlans.length}{" "}
              {insurancePlans.length === 1 ? "plan" : "plans"} found
            </Text>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View className="py-20">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        )}

        {/* Insurance Plans by Category */}
        <View className="px-5">
          {!loading && (
            <>
              {renderSection("Health")}
              {renderSection("Life")}
              {renderSection("Crop")}
              {renderSection("Accident")}
              {renderSection("Other")}
            </>
          )}
        </View>

        {/* Empty State */}
        {!loading && insurancePlans.length === 0 && (
          <View className="items-center justify-center py-20">
            <Ionicons
              name="document-text-outline"
              size={64}
              color={darkMode ? "#4b5563" : "#d1d5db"}
            />
            <Text
              className={`text-lg font-medium mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              No insurance plans found
            </Text>
            <Text
              className={`text-sm mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"
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

export default InsuranceScreen;