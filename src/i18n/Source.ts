import { createContext } from 'react';
import type { TDotPaths } from '@/types/dotPaths.type';
import type { TDeepStringify } from '@/types/deepStringify.type';
import type { Locale as AntLocale } from 'antd/es/locale';
import ruRU from 'antd/locale/ru_RU';
import enUS from 'antd/locale/en_US';
import { en } from './locales/en';
import { be } from './locales/be';
import { ru } from './locales/ru';

export const LOCALE_KEYS = ['ru', 'en', 'be'] as const;

export const LOCALES: Record<TLocaleKey, TTranslations> = { ru, en, be };

/**
 * Маппинг локалей приложения → локали antd.
 * Беларуская (be) не поддерживается antd — фоллбэк на ruRU.
 */
export const ANT_LOCALES: Record<TLocaleKey, AntLocale> = {
  ru: ruRU,
  en: enUS,
  be: ruRU,
};

/** Тип всех переводов — структура из русского словаря, значения — string */
export type TTranslations = TDeepStringify<typeof ru>;

/** Тип ключа перевода в формате dot-path (например 'common.appName') */
export type TTranslationKey = TDotPaths<TTranslations>;

/** Поддерживаемые языки */
export type TLocaleKey = (typeof LOCALE_KEYS)[number];

export type TI18nContext = {
  t: TTranslations;
  locale: TLocaleKey;
  antLocale: AntLocale;
  setLocale: (locale: TLocaleKey) => void;
};

export const I18nContext = createContext<TI18nContext | null>(null);

export class UI18n {
  static languageName(locale: TLocaleKey) {
    return LOCALES[locale].common.languageName;
  }

  static selectOptions() {
    return LOCALE_KEYS.map((key) => ({ value: key, label: UI18n.languageName(key) }));
  }
}
