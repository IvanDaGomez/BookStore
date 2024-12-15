// i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      goodbye: 'Goodbye'
      // Add more key-value pairs for translation
    }
  },
  es: {
    translation: {
      welcome: 'Bienvenido',
      goodbye: 'Adiós'
      // Add more key-value pairs for translation
    }
  }
}

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false // React already does escaping
    }
  })

export default i18n
