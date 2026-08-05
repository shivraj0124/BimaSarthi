import { translations } from "./translations";

export const t = (key, language) => {
  // console.log(key)
  return translations[language]?.[key] || translations["en"][key];
};
