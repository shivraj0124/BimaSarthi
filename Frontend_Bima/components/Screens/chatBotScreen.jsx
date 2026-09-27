import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useApp } from "../../contexts/AppContext";
import { useRouter } from "expo-router";
import { t } from "../../localization/translate";
export default function ChatBotScreen() {
  const { darkMode, language, user } = useApp();
  const router = useRouter();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        type: "mainActions",
      },
    ]);
  }, []);

  const mainActions = [
    { label: t("getRecommendation", language), action: "GET_RECOMMENDATION" },
    { label: t("claimHelp", language), action: "CLAIM_HELP" },
    { label: t("fraudInfo", language), action: "CLAIM_FRAUD" },
  ];

  const sendToBackend = async (action, value = "") => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/agent/chat`,
        {
          userId: user?._id,
          action,
          value,
          language,
        },
      );
      const { reply, options, recommendations } = response.data;

      // Add bot replyA
      if (reply) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: reply, sender: "bot" },
        ]);
      }

      // Survey Options
      if (options) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "options",
            data: options,
          },
        ]);
      }

      // Recommendation Cards
      if (recommendations) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            type: "recommendations",
            data: recommendations,
          },
        ]);
      }

      // 🔥 Always re-add main action buttons after response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 3,
          type: "mainActions",
        },
      ]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } catch (error) {
      // console.log(error.response?.data || error.message);
    }
  };

  const handleActionPress = async (label, action) => {
    // Add as user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: label, sender: "user" },
    ]);

    await sendToBackend(action);
  };

  const handleOptionPress = async (value) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: value, sender: "user" },
    ]);

    await sendToBackend("GET_RECOMMENDATION", value);
  };

  const handleFreeText = async () => {
    if (!input) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, sender: "user" },
    ]);

    setInput("");

    await sendToBackend("FREE_TEXT", input);
  };

  /* =============================
       RENDER CHAT ITEMS
    ============================= */

  const renderItem = ({ item }) => {
    // USER / BOT MESSAGE
    if (item.sender) {
      return (
        <View
          className={`px-4 py-3 rounded-xl my-1 max-w-[80%] ${
            item.sender === "user"
              ? "bg-green-600 self-end"
              : darkMode
                ? "bg-gray-800 self-start"
                : "bg-white self-start"
          }`}
        >
          <Text
            className={`text-lg ${
              item.sender === "user"
                ? "text-white"
                : darkMode
                  ? "text-white"
                  : "text-green-900"
            }`}
          >
            {item.text}
          </Text>
        </View>
      );
    }

    // SURVEY OPTIONS
    if (item.type === "options") {
      return (
        <View className="my-2">
          {item.data.map((opt, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionPress(opt)}
              className="bg-green-200 px-4 py-2 rounded-full my-1 self-start"
            >
              <Text className="text-green-900 font-semibold">{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // RECOMMENDATION CARDS
    if (item.type === "recommendations") {
      return (
        <View className="my-3">
          {item.data.map((rec) => (
            <View key={rec.id} className="bg-white rounded-xl p-4 mb-3 shadow">
              <Text className="text-xl font-semibold text-green-900">
                {rec.name}
              </Text>
              <Text className="text-lg text-green-700 mt-1">
                {rec.description}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    // MAIN ACTION BUTTONS (VERTICAL LEFT STYLE)
    if (item.type === "mainActions") {
      return (
        <View className="my-3">
          {mainActions.map((btn, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleActionPress(btn.label, btn.action)}
              className="bg-green-100 px-4 py-3 rounded-xl mb-2 self-start"
            >
              <Text className="text-green-900 font-semibold text-lg">
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      className={`flex-1 h-[200px] ${
        darkMode ? "bg-gray-900 z-20" : "bg-green-50 z-20"
      }`}
    >
      {/* HEADER */}
      <View className="flex-row items-center px-4 py-3 bg-green-600">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-white ml-4">
          Insurance Assistant
        </Text>
      </View>

      {/* CHAT */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-row items-center px-4 py-3 border-t border-green-200"
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask something..."
          placeholderTextColor="#6B7280"
          className="flex-1 bg-white rounded-full px-4 py-2 text-lg text-green-900"
        />

        <TouchableOpacity
          onPress={handleFreeText}
          className="ml-3 bg-green-600 p-3 rounded-full"
        >
          <Feather name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
