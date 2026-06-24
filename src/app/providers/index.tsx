import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import { lazy, type ReactNode, Suspense, useEffect, useMemo } from 'react';

import { useLocaleStore, useThemeStore } from '@/app/store';
import { GlobalStyles } from '@/app/styles/GlobalStyles';
import { useUserStore } from '@/entities/user';
import { getAntTheme } from '@/shared/config/antTheme';
import { env } from '@/shared/config/env';
import { queryClient } from '@/shared/config/queryClient';
import { I18nProvider } from '@/shared/i18n/i18n.provider';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { LoadingFallback } from '@/shared/ui/LoadingFallback';

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
  const checkAuth = useUserStore((s) => s.checkAuth);
  const mode = useThemeStore((s) => s.mode);
  const antLocale = useLocaleStore((s) => s.antLocale);
  const antTheme = useMemo(() => getAntTheme(mode), [mode]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={antTheme}
        locale={antLocale}
      >
        <AntApp>
          <GlobalStyles />
          <I18nProvider>
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
          </I18nProvider>
        </AntApp>
      </ConfigProvider>
      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}
