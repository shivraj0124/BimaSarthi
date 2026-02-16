import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FloatingChatButton() {
  const router = useRouter();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 80,
        right: 20,
        zIndex: 999,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push("/chatbotss")}
        style={{
          backgroundColor: "#16A34A",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 6, // Android shadow
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Feather name="message-circle" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
