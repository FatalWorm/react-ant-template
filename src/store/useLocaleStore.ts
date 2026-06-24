import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ANT_LOCALES } from '@/i18n/i18n.constants';
import type { TI18nContext } from '@/i18n/i18n.context';
import { STORAGE_KEYS } from '@/storage';

export const useLocaleStore = create<Omit<TI18nContext, 't'>>()(
  persist(
    (set) => ({
      locale: 'ru',
      antLocale: ANT_LOCALES['ru'],
      setLocale: (locale) => set({ locale, antLocale: ANT_LOCALES[locale] }),
    }),
    { name: STORAGE_KEYS.LOCALE },
  ),
);
