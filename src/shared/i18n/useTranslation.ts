import { useTranslation as _useTranslation } from 'react-i18next';

import type { TFunction } from './i18n.types';

/**
 * Типизированный хук перевода.
 * Возвращает `t` с автокомплитом ключей из JSON-словаря.
 *
 * @example
 * const { t, i18n } = useTranslation();
 * t('nav.home');           // ✅ автокомплит
 * t('nonexistent.key');    // ❌ TS error
 * i18n.changeLanguage('en');
 */
export function useTranslation() {
  const { t, i18n, ready } = _useTranslation();

  return { t: t as unknown as TFunction, i18n, ready };
}
