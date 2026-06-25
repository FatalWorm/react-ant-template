/**
 * @module i18n.config
 * @description Инициализация i18next с поддержкой 3 языков.
 *
 * Фичи:
 * - Автодетекция языка (localStorage → navigator)
 * - Fallback на русский
 * - Интерполяция: {{variable}}
 * - Типобезопасность через module augmentation (i18next.d.ts)
 *
 * Доступ к переводам:
 * - React-компоненты: `useTranslation()` → реактивный t()
 * - Store / утилиты: `import { t } from '@/shared/i18n'`
 */

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import be from './locales/be.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGS = ['ru', 'en', 'be'] as const;

export type TLocaleKey = (typeof SUPPORTED_LANGS)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      be: { translation: be },
    },
    fallbackLng: 'ru',
    supportedLngs: [...SUPPORTED_LANGS],
    interpolation: { escapeValue: false }, // React уже экранирует
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'app_locale',
      caches: ['localStorage'],
    },
  });

/**
 * Типизированная функция перевода для использования **вне React-компонентов**.
 * В React-компонентах используйте `useTranslation()`.
 */
export const t = i18n.t.bind(i18n);

export default i18n;
