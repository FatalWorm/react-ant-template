import type { Locale as AntLocale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';

import { be } from './locales/be';
import { en } from './locales/en';
import { ru } from './locales/ru';

export const LOCALE_KEYS = ['ru', 'en', 'be'] as const;

export const LOCALES = { ru, en, be };

export const ANT_LOCALES: Record<string, AntLocale> = {
  ru: ruRU,
  en: enUS,
  be: ruRU,
};
