// components/SliderIndicator.tsx
import { View } from "react-native";
import { useTheme } from "../../contexts/AppContext";

export default function SliderIndicator({ total, currentIndex }) {
  const { darkMode } = useTheme();

  return (
    <View className="flex-row mb-4">
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === currentIndex;
        return (
          <View
            key={idx}
            className={`mx-1 rounded-full ${
              isActive ? "bg-purple-500" : "bg-gray-400"
            }`}
            style={{ width: isActive ? 12 : 8, height: isActive ? 12 : 8 }}
          />
        );
      })}
    </View>
  );
}
