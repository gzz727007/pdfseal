import { ref, computed } from 'vue';
import en from './locales/en.json';
import zh from './locales/zh.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const dictionaries = { en, zh, de, es, fr };

// Determine initial language
function getInitialLang() {
  const saved = localStorage.getItem('pdfseal_lang');
  if (saved && dictionaries[saved]) return saved;

  const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('fr')) return 'fr';
  return 'en';
}

export const currentLang = ref(getInitialLang());

export function setLanguage(lang) {
  if (dictionaries[lang]) {
    currentLang.value = lang;
    localStorage.setItem('pdfseal_lang', lang);
    updateTitle();
  }
}

export function t(key) {
  const dict = dictionaries[currentLang.value] || dictionaries.en;
  return dict[key] || dictionaries.en[key] || key;
}

export function updateTitle() {
  document.title = t('page_title');
}

// Initialize title on load
updateTitle();
