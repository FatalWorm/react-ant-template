/**
 * @module GuestRoute
 * @description Гостевой маршрут: доступ только для неавторизованных. Авторизованных — редирект на главную.
 */

import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/entities/user';
import { env } from '@/shared/config/env';
import { LoadingFallback } from '@/shared/ui';

export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Если авторизация отключена — гостевые страницы недоступны
  if (!env.authEnabled)
    return (
      <Navigate
        to="/"
        replace
      />
    );

  if (isLoading) return <LoadingFallback />;
  if (isAuthenticated)
    return (
      <Navigate
        to="/"
        replace
      />
    );

  return <Outlet />;
}
