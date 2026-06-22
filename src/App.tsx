import { Suspense, useEffect, lazy, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { router } from '@/router/routes';
import { useAuthStore, useThemeStore } from '@/store';
import { useLocaleStore } from '@/store';
import { env } from '@/config/env';
import { I18nProvider } from '@/i18n';
import { getAntTheme } from '@/config/antTheme';
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
      <GlobalStyles />
      <ConfigProvider
        theme={antTheme}
        locale={antLocale}
      >
        <AntApp>
          <I18nProvider>
            <ErrorBoundary>
              <Suspense
                fallback={
                  <Spin
                    size="large"
                    style={{
                      margin: '20vh auto',
                      display: 'block',
                    }}
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
