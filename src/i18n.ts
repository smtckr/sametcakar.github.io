import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { STATIC_DICTIONARY } from './LanguageContext';

const resources = {
  tr: { translation: STATIC_DICTIONARY.tr },
  en: { translation: STATIC_DICTIONARY.en },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en'],
    keySeparator: false, // Critical: Disable dot separation so strings with dots/numbers translate properly
    nsSeparator: false,  // Critical: Disable colon separation so strings with colons translate properly
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupFromPathIndex: 0,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
