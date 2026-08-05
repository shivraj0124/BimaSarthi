import { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

function ThinkingBubble({ darkMode }) {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 150);
    const anim3 = animateDot(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  return (
    <View className="items-start mb-3">
      <View
        className={`px-5 py-4 rounded-3xl border ${
          darkMode
            ? "bg-emerald-900/40 border-emerald-800"
            : "bg-emerald-50 border-emerald-100"
        }`}
        style={{
          shadowColor: "#22c55e",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: darkMode ? 0.2 : 0.12,
          shadowRadius: 10,
          elevation: 4,
        }}
      >
        <View className="flex-row items-center">
          <View
            className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
              darkMode ? "bg-emerald-400/20" : "bg-emerald-500/20"
            }`}
          >
            <Text>🤖</Text>
          </View>
          <Text
            className={`font-semibold ${
              darkMode ? "text-emerald-50" : "text-emerald-900"
            }`}
          >
            Thinking
          </Text>
        </View>

        <View className="flex-row mt-3 ml-1">
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={{
                opacity: dot,
                transform: [
                  {
                    scale: dot.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.8, 1.15],
                    }),
                  },
                ],
              }}
              className={`w-2.5 h-2.5 rounded-full mr-2 ${
                darkMode ? "bg-emerald-300" : "bg-emerald-600"
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default ThinkingBubble;