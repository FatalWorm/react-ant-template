import type { ReactNode } from 'react';
import { useLocaleStore } from '@/store';
import { env } from '@/config/env';
import { ANT_LOCALES } from '@/i18n';

import { I18nContext, LOCALES } from './Source';

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);
  const antLocale = useLocaleStore((s) => s.antLocale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const effectiveLocale = env.i18nEnabled ? locale : 'ru';
  const effectiveAntLocale = env.i18nEnabled ? antLocale : ANT_LOCALES['ru'];
  const translations = LOCALES[effectiveLocale];

  return (
    <I18nContext
      value={{
        t: translations,
        locale: effectiveLocale,
        antLocale: effectiveAntLocale,
        setLocale,
      }}
    >
      {children}
    </I18nContext>
  );
}
