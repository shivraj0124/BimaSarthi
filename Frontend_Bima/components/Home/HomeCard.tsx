// components/HomeCard.tsx
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/AppContext";
import ImageSlider from "./ImageSlider";

export default function HomeCard() {
  const { darkMode } = useTheme();

  return (
    <View className={`rounded-2xl p-6 w-full max-w-md items-center bg-none`}>
      {/* Top Icon */}
      <MaterialIcons
        name="self-improvement"
        size={48}
        color={darkMode ? "#A78BFA" : "#6C63FF"}
        style={{ marginBottom: 12 }}
      />

      {/* Title */}
      <Text
        className={`text-3xl font-extrabold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Welcome!
      </Text>

      {/* Subtitle */}
      <Text
        className={`text-center mb-4 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Track your moods, journal your thoughts, and chat with your AI
        companion.
      </Text>

      {/* 🔹 Image Slider */}
      <ImageSlider />

      {/* 🔹 Motivational Tip */}
      <Text
        className={`text-center mb-6 italic ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        "Consistency is key! Track your mood daily to notice progress."
      </Text>

      {/* 🔹 Get Started Button */}
      <TouchableOpacity
        className="bg-purple-500 px-6 py-3 rounded-full shadow-md flex-row items-center active:scale-95 transition-transform"
        activeOpacity={0.8}
      >
        <Feather name="arrow-right-circle" size={22} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}
