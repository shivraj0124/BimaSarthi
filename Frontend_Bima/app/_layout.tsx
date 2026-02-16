import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useApp, AppProvider } from "../contexts/AppContext";
import "../global.css";
import FloatingChatButton from "../components/Screens/FloatingChatButton";

export default function RootLayout() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

function AppNavigator() {
  const { darkMode } = useApp();

  return (
    <NavigationThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Splash Screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Auth Screens */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />

        {/* Main App Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Survey */}
        <Stack.Screen
          name="survey"
          options={{ title: "Insurance Survey", headerShown: false }}
        />
        <Stack.Screen
          name="InsuranceDetails" options={{ headerShown: false }} />
    
        <Stack.Screen
          name="LearnDetail" options={{ headerShown: false }} />
    
        <Stack.Screen
          name="ClaimSc" options={{ headerShown: false }} />
    
        <Stack.Screen
          name="FraudSc" options={{ headerShown: false }} />
    
        <Stack.Screen
          name="chatbotss" options={{ headerShown: false }} />
    
        {/* Optional Modal */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      {/* <FloatingChatButton /> */}

      <StatusBar style={darkMode ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}
