/**
 * @module i18n.constants
 * @description Маппинг локалей приложения → Ant Design локалей.
 * Обновляется автоматически при смене языка через i18n.on('languageChanged').
 */

import type { Locale as AntLocale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';

export const ANT_LOCALES: Record<string, AntLocale> = {
  ru: ruRU,
  en: enUS,
  be: ruRU,
};
