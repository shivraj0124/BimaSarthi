import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useApp } from "../../contexts/AppContext";
import { useNavigation } from "@react-navigation/native";
import { t } from "../../localization/translate";
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

export default function ChatBotScreen() {
    const { darkMode, language, user } = useApp();
    const navigation = useNavigation();
    const flatListRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
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
    useEffect(() => {
        console.log("Current User in ChatBotScreen:", user?._id);
        setMessages([
            {
                id: Date.now(),
                type: "mainActions",
            },
        ]);

        // Keyboard listeners
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    const mainActions = [
        { label: t("getRecommendation", language), action: "GET_RECOMMENDATION", icon: "star-outline" },
        { label: t("claimHelp", language), action: "CLAIM_HELP", icon: "document-text-outline" },
        { label: t("fraudInfo", language), action: "CLAIM_FRAUD", icon: "shield-checkmark-outline" },
        { label: t("CANCEL_POLICY", language), action: "CANCEL_POLICY", icon: "close-circle" },
        { label: t("PREMIUM_INFO", language), action: "PREMIUM_INFO", icon: "add-circle-outline" },
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
                }
            );

            const { reply, options, recommendations, redirect } = response.data;

            if (reply) {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now(), text: reply, sender: "bot" },
                ]);
            }

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

            // 🔥 HANDLE REDIRECT BUTTON
            if (redirect) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 3,
                        type: "redirect",
                        data: redirect,
                    },
                ]);
            }

            // Re-add main buttons
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 4,
                    type: "mainActions",
                },
            ]);

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 200);
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    /* =============================
       HANDLE BUTTON CLICK
    ============================= */

    const handleActionPress = async (label, action) => {
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
            const isUser = item.sender === "user";
            return (
                <View className={`mb-3 ${isUser ? "items-end" : "items-start"}`}>
                    <View
                        className={`px-5 py-3 rounded-3xl max-w-[80%] ${isUser ? "" : darkMode ? "bg-gray-800" : "bg-white"
                            }`}
                        style={
                            isUser
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
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }
                        }
                    >
                        {isUser ? (
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="absolute inset-0 rounded-3xl"
                            />
                        ) : null}
                        <View className="flex-col items-start justify-between ">
                            <Text
                                className={`text-lg leading-6 ${isUser
                                    ? "text-white"
                                    : darkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                            >
                                {item.text}
                            </Text>
                            <TouchableOpacity onPress={() => speakInfo(item.text)} className="ml-2 p-1 w-max rounded-full bg-green-100">
                                    <Feather name="volume-2" size={24} color="#059669" />
                                </TouchableOpacity>
                        </View>
                    </View>
                    {/* Timestamp */}
                    <Text
                        className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                    >
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            );
        }

        // SURVEY OPTIONS
        if (item.type === "options") {
            return (
                <View className="my-3">
                    <Text
                        className={`text-lg mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Choose an option:
                    </Text>
                    {item.data.map((opt, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleOptionPress(opt)}
                            className="rounded-2xl mb-2"
                            style={{
                                backgroundColor: darkMode ? '#374151' : '#dcfce7',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                                elevation: 1,
                            }}
                        >
                            <View className="flex-row items-center px-4 py-3">
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={20}
                                    color={darkMode ? '#86efac' : '#059669'}
                                />
                                <Text
                                    className="ml-3 font-semibold text-xl"
                                    style={{ color: darkMode ? '#86efac' : '#059669' }}
                                >
                                    {t(`${opt}`, language)}
                                </Text>
                                <TouchableOpacity onPress={() => speakInfo(t(`${opt}`, language))} className="ml-2 p-1 rounded-full bg-green-100">
                                    <Feather name="volume-2" size={24} color="#059669" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        // RECOMMENDATION CARDS
        if (item.type === "recommendations") {
            return (
                <View className="my-3">
                    <Text
                        className={`text-md mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        {t("recommendedForYou", language)}
                    </Text>
                    {item.data.map((rec) => (
                        <View
                            key={rec.id}
                            className={`rounded-3xl p-5 mb-3 ${darkMode ? "bg-gray-800" : "bg-white"
                                }`}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 5,
                            }}
                        >
                            <View className="flex-row items-start justify-between mb-2">
                                <Text
                                    className={`text-xl font-bold flex-1 ${darkMode ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    {rec.name}
                                </Text>
                                {/* <Ionicons name="information-circle" size={24} color="#10b981" /> */}
                                <TouchableOpacity onPress={() => speakInfo(rec.name)} className="ml-2 p-1 w-max rounded-full bg-green-100">
                                    <Feather name="volume-2" size={24} color="#059669" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-col items-start justify-between">
                                <Text
                                    className={`text-lg leading-6 ${darkMode ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    {rec.description}
                                </Text>
                                <TouchableOpacity onPress={() => speakInfo(rec.description)} className="ml-2 p-1 rounded-full bg-green-100 w-max">
                                    <Feather name="volume-2" size={24} color="#059669" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            );
        }

        // MAIN ACTION BUTTONS
        if (item.type === "mainActions") {
            return (
                <View className="my-3">
                    <Text
                        className={`text-md mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        {t("howCanIHelp", language)}
                    </Text>
                    {mainActions.map((btn, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleActionPress(btn.label, btn.action)}
                            className="rounded-2xl mb-3"
                            style={{
                                backgroundColor: darkMode ? '#374151' : '#ffffff',
                                borderWidth: 2,
                                borderColor: '#10b981',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <View className="flex-row items-center px-5 py-4">
                                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                                    <Ionicons name={btn.icon} size={20} color="#059669" />
                                </View>
                                <Text
                                    className={`ml-4 font-semibold text-xl ${darkMode ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    {btn.label}
                                </Text>
                                <TouchableOpacity onPress={() => speakInfo(btn.label)} className="ml-2 p-1 w-max rounded-full bg-green-100">
                                    <Feather name="volume-2" size={24} color="#059669" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        // REDIRECT BUTTON
        if (item.type === "redirect") {
            return (
                <TouchableOpacity
                    onPress={() => navigation.navigate(item.data.route)}
                    className="rounded-2xl my-3 overflow-hidden"
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
                        className="px-6 py-4 flex-row items-center justify-between"
                    >
                        <Text className="text-white font-bold text-lg flex-1">
                            {t(item.data.label, language)}
                        </Text>
                        <TouchableOpacity onPress={() => speakInfo(t(item.data.label, language))} className="ml-2 p-1 w-max rounded-full bg-green-100">
                                    <Feather name="volume-2" size={24} color="#059669" />
                                </TouchableOpacity>
                        <Ionicons name="arrow-forward-circle" size={36} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <SafeAreaView
            edges={["top"]}
            className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
            {/* HEADER */}
            <LinearGradient
                colors={darkMode ? ['#1f2937', '#111827'] : ['#10b981', '#059669']}
                className="px-5 py-4"
            >
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <View className="ml-4 flex-1">
                        <Text className="text-xl font-bold text-white">
                            {t("insuranceAssistant", language)}
                        </Text>
                        <Text className="text-white/80 text-md">
                            {t("alwaysHereToHelp", language)}
                        </Text>
                    </View>

                    <View className="w-3 h-3 rounded-full bg-green-400" />
                </View>
            </LinearGradient>

            {/* CHAT */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 120, // Extra space for input above tabs
                }}
                onContentSizeChange={() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }}
            />

            {/* INPUT - FIXED AT BOTTOM ABOVE TABS */}
            <View
                style={{
                    position: 'absolute',
                    bottom: keyboardHeight > 0 ? keyboardHeight : 70, // Keyboard height or tab bar height
                    left: 0,
                    right: 0,
                }}
            >
                <View
                    className={`flex-row items-center px-5 py-3 border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                        }`}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 8,
                    }}
                >
                    <View
                        className={`flex-1 flex-row items-center rounded-full px-4 py-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                    >
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder={t("askSomething", language)}
                            placeholderTextColor={darkMode ? "#9ca3af" : "#6b7280"}
                            className={`flex-1 text-base ${darkMode ? "text-white" : "text-gray-900"
                                }`}
                            multiline
                            maxLength={500}
                            onSubmitEditing={handleFreeText}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleFreeText}
                        className="ml-3 rounded-full"
                        style={{
                            shadowColor: "#10b981",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="w-12 h-12 rounded-full overflow-hidden items-center justify-center"
                        >
                            <Ionicons name="send" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}