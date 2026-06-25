/**
 * @module useTranslation
 * @description Типизированный хук перевода.
 *
 * Строгая типизация `t` обеспечена через module augmentation (`i18next.d.ts`):
 * ключи и параметры интерполяции выводятся из `ru.json` нативно — без кастов.
 *
 * @example
 * const { t, i18n } = useTranslation();
 * t('nav.home');                        // ✅ автокомплит
 * t('validation.minChars', { min: 6 }); // ✅ интерполяция типизирована
 * t('nonexistent.key');                 // ❌ TS error
 * i18n.changeLanguage('en');
 */

import { useTranslation as _useTranslation } from 'react-i18next';

export function useTranslation() {
  return _useTranslation();
}
