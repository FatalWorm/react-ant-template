/**
 * @module i18next.d.ts
 * @description Module augmentation для i18next: регистрация ресурсов перевода.
 *
 * Активирует строгую типизацию TFunction напрямую в react-i18next:
 * - `t('nav.home')` — автокомплит ✅
 * - `t('nonexistent')` — TS error ✅
 * - `t('validation.minChars', { min: 6 })` — интерполяция типизирована ✅
 *
 * После этого файла касты `as unknown as TFunction` больше не нужны.
 */

import 'i18next';

import type ru from './locales/ru.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    /** Пространство имён по умолчанию */
    defaultNS: 'translation';
    /** Запрещаем возврат null — t() всегда возвращает string */
    returnNull: false;
    /** Ресурсы строятся по эталонному ru.json (fallbackLng) */
    resources: {
      translation: typeof ru;
    };
  }
}
