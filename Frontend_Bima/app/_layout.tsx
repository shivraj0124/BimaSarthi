import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useApp, AppProvider } from "../contexts/AppContext";
import "../global.css";

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
    <>
      <Stack>
        {/* Splash Screen */}
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        {/* Auth Screens */}
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="signup"
          options={{ headerShown: false }}
        />

        {/* Main App Tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Survey */}
        <Stack.Screen
          name="survey"
          options={{
            title: "Insurance Survey",
            headerShown: false,
          }}
        />

        {/* Insurance Details */}
        <Stack.Screen
          name="InsuranceDetails"
          options={{ headerShown: false }}
        />

        {/* Learn Details */}
        <Stack.Screen
          name="LearnDetail"
          options={{ headerShown: false }}
        />

        {/* Claim */}
        <Stack.Screen
          name="ClaimSc"
          options={{ headerShown: false }}
        />

        {/* Fraud */}
        <Stack.Screen
          name="FraudSc"
          options={{ headerShown: false }}
        />

        {/* Chatbot */}
        <Stack.Screen
          name="chatbotss"
          options={{ headerShown: false }}
        />

        {/* Modal */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
          }}
        />
      </Stack>

      <StatusBar style={darkMode ? "light" : "dark"} />
    </>
  );
}