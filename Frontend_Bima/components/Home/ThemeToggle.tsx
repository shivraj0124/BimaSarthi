// components/ThemeToggle.tsx
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/AppContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      className={`flex-row items-center px-2 py-2 rounded-full ${
        darkMode ? "bg-gray-700" : "bg-white"
      }`}
    >
      <Feather
        name={darkMode ? "sun" : "moon"}
        size={18}
        color={darkMode ? "#FFD700" : "#333"}
      />
    </TouchableOpacity>
  );
}
