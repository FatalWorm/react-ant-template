/**
 * @module i18n.types
 * @description Типы для i18n, выведенные напрямую из русского JSON-словаря.
 * Не зависят от module augmentation i18next — работают стабильно с любой версией.
 */

import type ru from './locales/ru.json';

/** Рекурсивно строит union всех dot-path ключей из JSON-объекта */
type TFlatKeys<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? TFlatKeys<T[K], `${Prefix}${K}.`> : `${Prefix}${K}`;
}[keyof T & string];

/** Все допустимые ключи перевода: 'nav.home' | 'auth.loginTitle' | ... */
export type TTranslationKey = TFlatKeys<typeof ru>;

/** Типизированная функция перевода */
export type TFunction = {
  (key: TTranslationKey, options?: Record<string, unknown>): string;
};
