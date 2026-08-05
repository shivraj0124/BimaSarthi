import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext();



export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("APP_THEME");
      const savedLang = await AsyncStorage.getItem("APP_LANG");
      const savedUser = await AsyncStorage.getItem("user");
      setIsLoggedIn(savedUser ? true : false);
      // console.log("Saved User:", savedUser, isLoggedIn);
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      }

      if (savedLang) {
        setLanguage(savedLang);
      }
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // console.log("Error loading preferences:", error);
    }
  };

  /* ---------- Theme Functions ---------- */
  const toggleTheme = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem("APP_THEME", newValue ? "dark" : "light");
  };

  const setTheme = async (value) => {
    setDarkMode(value);
    await AsyncStorage.setItem("APP_THEME", value ? "dark" : "light");
  };

  const saveUser = async (value) => {
    setUser(value);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  }

  /* ---------- Language Functions ---------- */
  const setAppLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem("APP_LANG", lang);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleTheme,
        setTheme,
        language,
        setAppLanguage,
        user,
        saveUser,
        isLoggedIn,
        setIsLoggedIn
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* ---------- Custom Hook ---------- */
export const useApp = () => {
  return useContext(AppContext);
};
