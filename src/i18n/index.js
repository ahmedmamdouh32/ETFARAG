import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ar from './ar.json'

function applyDocumentLanguage(language) {
  const html = document.documentElement
  html.lang = language
  html.dir = language === 'ar' ? 'rtl' : 'ltr'
}

const savedLanguage = localStorage.getItem('language') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

applyDocumentLanguage(savedLanguage)

i18n.on('languageChanged', (language) => {
  localStorage.setItem('language', language)
  applyDocumentLanguage(language)
})

export default i18n
