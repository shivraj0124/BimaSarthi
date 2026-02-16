import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../contexts/AppContext";
import { t } from "../localization/translate";




const SurveyScreen = () => {
  const { darkMode,language } = useApp();
  console.log(language)
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age: "",
    occupation: "",
    income: "",
    concern: "",
  });

  const handleSelect = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderOptions = (key, options) => (
    <View className="mt-6">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => handleSelect(key, opt.value)}
          className={`p-4 rounded-xl mb-4 flex-row items-center ${
            answers[key] === opt.value
              ? "bg-green-600"
              : darkMode
              ? "bg-gray-800"
              : "bg-white"
          }`}
        >
          <Feather
            name={opt.icon}
            size={22}
            color={answers[key] === opt.value ? "#fff" : "#166534"}
          />
          <Text
            className={`ml-4 text-lg font-semibold ${
              answers[key] === opt.value
                ? "text-white"
                : darkMode
                ? "text-white"
                : "text-green-900"
            }`}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      edges={["top"]}
      className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-green-50"}
    >
      {/* Header */}
      <View
        className={`h-14 px-4 flex-row items-center ${
          darkMode ? "bg-gray-800" : "bg-green-100"
        }`}
      >
        <Feather
          name="clipboard"
          size={20}
          color={darkMode ? "#fff" : "#166534"}
        />
        <Text
          className={`ml-2 text-xl font-semibold ${
            darkMode ? "text-white" : "text-green-900"
          }`}
        >
         
          {t("insuranceSurvey", language)}
        </Text>
      </View>

      <View className="px-4 pt-8 flex-1">
        {/* Progress */}
        <Text className="text-lg text-green-700 mb-2">
          Step {step} of 4
        </Text>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <Text className="text-2xl font-semibold text-green-900">
              What is your age group?
            </Text>
            {renderOptions("age", [
              { label: "18 – 30 years", value: "18-30", icon: "user" },
              { label: "31 – 45 years", value: "31-45", icon: "users" },
              { label: "46 – 60 years", value: "46-60", icon: "calendar" },
              { label: "Above 60", value: "60+", icon: "clock" },
            ])}
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <Text className="text-2xl font-semibold text-green-900">
              What is your occupation?
            </Text>
            {renderOptions("occupation", [
              { label: "Farmer", value: "farmer", icon: "cloud-rain" },
              { label: "Labourer", value: "labourer", icon: "tool" },
              { label: "Self-employed", value: "self", icon: "briefcase" },
              { label: "Other", value: "other", icon: "more-horizontal" },
            ])}
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <Text className="text-2xl font-semibold text-green-900">
              Monthly income range?
            </Text>
            {renderOptions("income", [
              { label: "Below ₹10,000", value: "<10k", icon: "trending-down" },
              {
                label: "₹10,000 – ₹25,000",
                value: "10k-25k",
                icon: "bar-chart",
              },
              { label: "Above ₹25,000", value: "25k+", icon: "trending-up" },
            ])}
          </>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <>
            <Text className="text-2xl font-semibold text-green-900">
              What do you want to protect?
            </Text>
            {renderOptions("concern", [
              { label: "Health & medical", value: "health", icon: "heart" },
              { label: "Family future", value: "life", icon: "shield" },
              { label: "Crop / farming", value: "crop", icon: "leaf" },
              { label: "Accidents", value: "accident", icon: "alert-triangle" },
            ])}
          </>
        )}
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between px-4 pb-6">
        {step > 1 && (
          <TouchableOpacity
            onPress={prevStep}
            className="px-6 py-3 rounded-xl bg-white border border-green-600"
          >
            <Text className="text-lg font-semibold text-green-700">
              Back
            </Text>
          </TouchableOpacity>
        )}

        {step < 4 ? (
          <TouchableOpacity
            onPress={nextStep}
            className="px-6 py-3 rounded-xl bg-green-600 ml-auto"
          >
            <Text className="text-lg font-semibold text-white">
              Next
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="px-6 py-3 rounded-xl bg-green-600 ml-auto">
            <Text className="text-lg font-semibold text-white">
              Get Recommendation
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SurveyScreen;
