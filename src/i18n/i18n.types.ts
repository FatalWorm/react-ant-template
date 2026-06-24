import type { TDeepStringify } from '@/types/deepStringify.type';
import type { TDotPaths } from '@/types/dotPaths.type';

import type { LOCALE_KEYS } from './i18n.constants';
import type { ru } from './locales/ru';

/** Тип всех переводов — структура из русского словаря, значения — string */
export type TTranslations = TDeepStringify<typeof ru>;

/** Тип ключа перевода в формате dot-path (например 'common.appName') */
export type TTranslationKey = TDotPaths<TTranslations>;

/** Поддерживаемые языки */
export type TLocaleKey = (typeof LOCALE_KEYS)[number];

