import { LOCALE_KEYS, LOCALES } from './i18n.constants';
import type { TLocaleKey } from './i18n.types';

export class UI18n {
  static languageName(locale: TLocaleKey) {
    return LOCALES[locale].common.languageName;
  }

  static selectOptions() {
    return LOCALE_KEYS.map((key) => ({ value: key, label: UI18n.languageName(key) }));
  }
}
