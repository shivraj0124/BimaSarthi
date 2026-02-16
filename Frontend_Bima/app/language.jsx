import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../contexts/AppContext";
import { t } from "../localization/translate";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LanguageScreen() {
  const { language, setAppLanguage } = useApp();
  const router = useRouter();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "mr", label: "मराठी" },
  ];

  const handleSelect = async (lang) => {
     const user = await AsyncStorage.getItem("user");
      const savedLang = await AsyncStorage.getItem("APP_LANG");

    await setAppLanguage(lang);
     await AsyncStorage.setItem("APP_LANG",lang);
     if(!user){
     router.replace("/login");}
     else{
       router.replace("/(tabs)/home"); 

     } // Navigate to main app
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50 px-6 justify-center">
      {/* Title */}
      <Text className="text-2xl font-semibold text-green-900 text-center mb-8">
        {t("selectLanguage", language)}
      </Text>

      {/* Language Options */}
      {languages.map((item) => (
        <TouchableOpacity
          key={item.code}
          onPress={() => handleSelect(item.code)}
          className={`flex-row items-center justify-between p-4 mb-4 rounded-xl border ${
            language === item.code
              ? "bg-green-600 border-green-600"
              : "bg-white border-green-200"
          }`}
        >
          <Text
            className={`text-xl font-semibold ${
              language === item.code ? "text-white" : "text-green-900"
            }`}
          >
            {item.label}
          </Text>

          {language === item.code && (
            <Feather name="check-circle" size={22} color="#ffffff" />
          )}
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}
