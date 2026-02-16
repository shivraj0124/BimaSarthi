// components/ImageSlider.tsx
import { FlatList, Image, Dimensions, Animated } from "react-native";
import { useRef, useState } from "react";
import SliderIndicator from "./SliderIndicator";

const { width } = Dimensions.get("window");

const images = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fit=crop&w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fit=crop&w=600",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fit=crop&w=600",
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      },
    }
  );

  return (
    <>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{
              width: width * 0.8,
              height: 180,
              borderRadius: 16,
              marginHorizontal: width * 0.01,
            }}
          />
        )}
        className="mb-2"
      />
      <SliderIndicator total={images.length} currentIndex={currentIndex} />
    </>
  );
}
