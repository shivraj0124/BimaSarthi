import React from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useApp } from "../../contexts/AppContext";
import { LinearGradient } from 'expo-linear-gradient'; // Install: expo install expo-linear-gradient
import { Feather, Ionicons } from '@expo/vector-icons'; // For the back arrow icon
import { t } from "../../localization/translate";
import * as Speech from 'expo-speech';
const InsuranceDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { plan } = route.params;
  const { darkMode, language } = useApp();
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

  // Section Component
  const Section = ({ title, children }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <View className="w-1 h-6 bg-green-500 rounded-full mr-3" />
        <Text
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"
            }`}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

  // Benefit Item Component
  const BenefitItem = ({ text, index }) => (
    <View className="flex-row mb-3 jusitify-center items-center">
      <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
        <Text className="text-green-700 font-bold">{index + 1}</Text>
      </View>
      <Text
        className={`flex-1 text-xl leading-6 ${darkMode ? "text-gray-300" : "text-gray-700"
          }`}
      >
        {text}
      </Text>
      <TouchableOpacity onPress={() => speakInfo(benefit)} className=" p-1 w-max rounded-full bg-green-100">
        <Feather name="volume-2" size={24} color="#059669" />
      </TouchableOpacity>
    </View>
  );

  // Document Item Component
  const DocumentItem = ({ text, index }) => (
    <View
      className={`flex-row items-center p-3 mb-2 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"
        }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View className="w-2 h-2 rounded-full bg-green-500 mr-3" />
      <Text
        className={`flex-1 text-xl ${darkMode ? "text-gray-300" : "text-gray-700"
          }`}
      >
        {text}
      </Text>
      <TouchableOpacity onPress={() => speakInfo(text)} className=" p-1 w-max rounded-full bg-green-100">
        <Feather name="volume-2" size={24} color="#059669" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-gray-50"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Image with Gradient Overlay */}
        <View className="relative mb-6">
          <Image
            source={{
              uri:
                plan.imageUrl ||
                "https://www.pngplay.com/wp-content/uploads/7/Insurance-Transparent-Images.png",
            }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', darkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(249, 250, 251, 0.9)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-6 left-4 rounded-full p-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#059669" />
          </TouchableOpacity>
        </View>

        <View className="px-5">
          {/* Plan Name */}
          <Text
            className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {plan.name}
          </Text>

          {/* Premium & Coverage Cards */}
          <View className="flex-row gap-3 mb-6">
            {/* Premium Card */}
            <View
              className="flex-1 rounded-2xl p-6"
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-lg text-gray-500 mb-1">{t("monthlyPremium", language)}</Text>
              <Text className="text-2xl font-bold text-green-600">
                {plan.premium || "N/A"}
              </Text>
            </View>

            {/* Coverage Card */}
            <View
              className="flex-1 rounded-2xl p-6"
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-lg text-gray-500 mb-1">{t("coverage", language)}</Text>
              <Text className="text-2xl font-bold text-green-600">
                {plan.coverageAmount || "N/A"}
              </Text>
            </View>
          </View>

          {/* Overview */}
          {plan?.detailedInformation?.overview && (
            <Section title={t("overview", language)}>
              <View
                className={`rounded-2xl flex-col justify-start items-start p-6 ${darkMode ? "bg-gray-800" : "bg-white"
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
                  {plan.detailedInformation.overview}
                </Text>
                <TouchableOpacity onPress={() => speakInfo(plan.detailedInformation.overview)} className=" p-1 w-max rounded-full bg-green-100">
                  <Feather name="volume-2" size={24} color="#059669" />
                </TouchableOpacity>
              </View>
            </Section>
          )}

          {/* Benefits */}
          {plan.detailedInformation?.benefits?.length > 0 && (
            <Section title={t("keyBenefits", language)}>
              <View
                className={`rounded-2xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                {plan.detailedInformation.benefits.map((benefit, index) => (
                  <View className="flex-col items-satrt justify-start" key={index}>
                    <BenefitItem key={index} text={benefit} index={index} />

                  </View>
                ))}
              </View>
            </Section>
          )}

          {/* Eligibility */}
          {plan.detailedInformation?.eligibility && (
            <Section title={t("eligibility", language)}>
              <View
                className={`rounded-2xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-col items-start justify-start">
                  <Text
                    className={`text-xl leading-7 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {plan.detailedInformation.eligibility}
                  </Text>
                  <TouchableOpacity onPress={() => speakInfo(plan.detailedInformation.eligibility)} className="ml-2 p-1 w-max rounded-full bg-green-100">
                    <Feather name="volume-2" size={24} color="#059669" />
                  </TouchableOpacity>
                </View>
              </View>
            </Section>
          )}

          {/* Claim Process */}
          {plan.detailedInformation?.claimProcess && (
            <Section title={t("claimProcess", language)}>
              <View
                className={`rounded-2xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-col items-start justify-start">

                  <Text
                    className={`text-xl leading-7 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {plan.detailedInformation.claimProcess}
                  </Text>
                  <TouchableOpacity onPress={() => speakInfo(plan.detailedInformation.claimProcess)} className="ml-2 p-1 w-max rounded-full bg-green-100">
                    <Feather name="volume-2" size={24} color="#059669" />
                  </TouchableOpacity>
                </View>
              </View>
            </Section>
          )}

          {/* Documents Required */}
          {plan.documentsRequired?.length > 0 && (
            <Section title={t("documentsRequired", language)}>
              {plan.documentsRequired.map((doc, index) => (
                <View className="flex-row items-center justify-between" key={index}>
                  <DocumentItem key={index} text={doc} index={index} />

                </View>
              ))}
            </Section>
          )}

          {/* CTA Button */}
          {/* <TouchableOpacity
            className="rounded-2xl overflow-hidden mt-4"
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
              className="py-4 items-center"
            >
              <Text className="text-white text-lg font-bold">
                Apply Now
              </Text>
            </LinearGradient>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InsuranceDetailsScreen;