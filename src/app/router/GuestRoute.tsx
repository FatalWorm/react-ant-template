/**
 * @module GuestRoute
 * @description Гостевой маршрут: доступ только для неавторизованных. Авторизованных — редирект на главную.
 */

import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/Entities/User';

import { env } from '@/Shared/Config/Env';
import { LoadingFallback } from '@/Shared/Ui';

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
