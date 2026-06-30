/**
 * @module i18n
 * @description Конфигурация i18n-слоя.
 */
import { initReactI18next, useTranslation, type UseTranslationOptions } from 'react-i18next';
import type { Locale as AntLocale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';
import type { TOptions } from 'i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import type { TDeepKeyPaths } from '../Types/TDeepKeyPaths';
import type { TDeepStringify } from '../Types/TDeepStringify';
import { be } from './Locales/Be';
import { en } from './Locales/En';
import { ru } from './Locales/Ru';

export const SUPPORTED_LANGS = ['ru', 'en', 'be'] as const;

export const ANT_LOCALES: Record<string, AntLocale> = {
  ru: ruRU,
  en: enUS,
  be: ruRU,
};

export type TSupportedLang = (typeof SUPPORTED_LANGS)[number];

// Экспортируем форму словаря для валидации других языков
export type TTranslationShape = TDeepStringify<typeof ru>;

export type TTranslationKey = TDeepKeyPaths<typeof ru>;

export type TFunction = {
  <Key extends TTranslationKey, Opt extends TOptions>(key: Key | Key[], options?: Opt): string;
};

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
export const t = i18n.t.bind(i18n) as unknown as TFunction;

export function useAppTranslation(options?: UseTranslationOptions<undefined>) {
  // Вызываем оригинальный хук
  const result = useTranslation('translation', options);

  return {
    ...result,
    // Подменяем тип функции t на наш "непробиваемый" вариант
    t: result.t as unknown as TFunction,
  };
}

export { i18n };

export default i18n;
