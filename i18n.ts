import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { languages } from './lib/languages';

const supportedLngs = languages.map(lang => lang.code);

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs,
    fallbackLng: 'en',
    detection: {
      order: ['cookie', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: true,
    }
  });

// Set text direction on language change
i18next.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18next.dir(lng);
});

// Set initial direction
if (i18next.language) {
    document.documentElement.lang = i18next.language;
    document.documentElement.dir = i18next.dir(i18next.language);
}

export default i18next;