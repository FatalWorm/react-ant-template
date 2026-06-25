/**
 * @module i18n.types
 * @description Публичные типы i18n-слоя.
 *
 * Строгая типизация обеспечена через module augmentation в `i18next.d.ts`:
 * `CustomTypeOptions.resources` регистрирует `ru.json` как эталон,
 * после чего i18next генерирует все типы нативно — без ручных утилит.
 */

export type { TFunction } from 'i18next';
export type { ParseKeys as TTranslationKey } from 'i18next';
