import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import resources from "../translations.json";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    resources,
    ns: ["general", "channel", "message", "settings", "emoji"],
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
