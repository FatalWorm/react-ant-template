import { lazy, type ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';

import { useThemeStore } from '@/App/Store';
import { GlobalStyles } from '@/App/Styles/GlobalStyles';

import { useAuthStore } from '@/Entities/User';

import { getAntTheme } from '@/Shared/Config/AntTheme';
import { env } from '@/Shared/Config/Env';
import { queryClient } from '@/Shared/Config/QueryClient';
import { ANT_LOCALES, i18n } from '@/Shared/I18n';
import { ErrorBoundary } from '@/Shared/Ui';
import { LoadingFallback } from '@/Shared/Ui';

const ReactQueryDevtools = env.isDev
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : () => null;

type TAppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: TAppProvidersProps) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const mode = useThemeStore((s) => s.mode);
  const antTheme = useMemo(() => getAntTheme(mode), [mode]);

  /** Ant Design locale, синхронизируется с i18next */
  const [antLocale, setAntLocale] = useState(ANT_LOCALES[i18n.language] ?? ANT_LOCALES['ru']);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /** Подписка на смену языка — обновляем Ant Design locale */
  useEffect(() => {
    const handleLangChange = (lng: string) => {
      setAntLocale(ANT_LOCALES[lng] ?? ANT_LOCALES['ru']);
    };

    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={antTheme}
        locale={antLocale}
      >
        <AntApp>
          <GlobalStyles />
          <ErrorBoundary>
            <Suspense
              fallback={
                <LoadingFallback
                  wrapper={{ justify: 'center', align: 'center', style: { minHeight: '100vh' } }}
                  spin={{ size: 'large' }}
                />
              }
            >
              {children}
            </Suspense>
          </ErrorBoundary>
        </AntApp>
      </ConfigProvider>
      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}
