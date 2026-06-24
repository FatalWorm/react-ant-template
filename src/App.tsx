import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '@/components/LoadingFallback';
import { getAntTheme } from '@/config/antTheme';
import { env } from '@/config/env';
import { queryClient } from '@/config/queryClient';
import { I18nProvider } from '@/i18n/i18n.provider';
import { router } from '@/router/routes';
import { useAuthStore, useThemeStore } from '@/store';
import { useLocaleStore } from '@/store';
import { GlobalStyles } from '@/styles/GlobalStyles';

const ReactQueryDevtools = env.isDev
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : () => null;

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
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
                <RouterProvider router={router} />
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

export default App;
