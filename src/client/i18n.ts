import i18next from "i18next";
import emoji from "i18next-emoji-postprocessor";
import { initReactI18next } from "react-i18next";
import resources from "../translations.json";

i18next
  .use(initReactI18next)
  .use(emoji)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
  })
  .then((_t) => {
    console.log("Initialized i18next");
  })
  .catch(() => {
    console.error("! Failed to initialize i18next");
  });

export default i18next;
