import type { Locale as AntLocale } from 'antd/es/locale';
import { createContext } from 'react';

import type { TLocaleKey, TTranslations } from './i18n.types';

export type TI18nContext = {
    t: TTranslations;
    locale: TLocaleKey;
    antLocale: AntLocale;
    setLocale: (locale: TLocaleKey) => void;
};

export const I18nContext = createContext<TI18nContext | null>(null);