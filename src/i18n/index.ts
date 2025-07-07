/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// LANGUAGE FILES
import en_US from "../languages/en_US.json";
import pt_BR from "../languages/pt_BR.json";
import es_ES from "../languages/es.json";
import fr_FR from "../languages/fr_FR.json";
i18n
  .use(LanguageDetector)
  .use(initReactI18next)

  .init({
    debug: true,
    supportedLngs: ['pt-BR', 'en', 'es', 'fr'],
    fallbackLng: "pt-BR",
    detection: {
      order: ["queryString", "cookie"],
      caches: ["cookie"],
    },
    resources: {
      "pt-BR": {
        translation: pt_BR,
      },      
      en: {
        translation: en_US,
      },
      es: {
        translation: es_ES,
      },
      fr: {
        translation: fr_FR,
      },
    },
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
