import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useRef } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";
import { useApp } from "../../contexts/AppContext";
import { t } from "../../localization/translate";
import Svg, { Path } from 'react-native-svg';

export default function TabsLayout() {
  const { darkMode, language } = useApp();
  const isDark = darkMode;

  const AnimatedIcon = ({ name, color, size = 25 }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialIcons
          name={name}
          size={size}
          color={color}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      </Animated.View>
    );
  };

  // Custom Tab Bar Background with Curve
  const TabBarBackground = () => (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 375 70" preserveAspectRatio="none">
        <Path
          d="M0 0 H375 V70 H0 V0 Z M140 0 Q145 0 150 5 Q155 10 157.5 17.5 Q160 25 165 30 Q170 35 187.5 35 Q205 35 210 30 Q215 25 217.5 17.5 Q220 10 225 5 Q230 0 235 0"
          fill={isDark ? "#121212" : "#fff"}
        />
      </Svg>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#16A34A",
        tabBarInactiveTintColor: isDark ? "#888" : "#999",
        tabBarStyle: {
          height: 70,
          paddingVertical: 8,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 70,
              backgroundColor: isDark ? "#121212" : "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.15,
              shadowRadius: 5,
              elevation: 5,
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
          marginTop: -4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("home", language),
          tabBarIcon: ({ color, size }) => (
            <AnimatedIcon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="insurance"
        options={{
          title: t("insurance", language),
          tabBarIcon: ({ color, size }) => (
            <AnimatedIcon name="health-and-safety" color={color} size={size} />
          ),
        }}
      />

      {/* FLOATING CHAT BUTTON WITH CURVE */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: 'absolute',
                top: -8,
                width: 65,
                height: 65,
                borderRadius: 35,
                backgroundColor: focused ? '#16A34A' : '#10B981',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#16A34A',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
                borderWidth: 4,
                borderColor: isDark ? '#121212' : '#fff',
              }}
            >
              <MaterialIcons name="chat" size={30} color="white" />
              {/* Small badge/indicator */}
              <View
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#EF4444',
                  borderWidth: 2,
                  borderColor: 'white',
                }}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: t("learn", language),
          tabBarIcon: ({ color, size }) => (
            <AnimatedIcon name="lightbulb" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile", language),
          tabBarIcon: ({ color, size }) => (
            <AnimatedIcon name="event-note" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}