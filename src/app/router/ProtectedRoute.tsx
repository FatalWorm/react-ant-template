/**
 * @module ProtectedRoute
 * @description Защищённый маршрут: требует авторизации. Неавторизованных — редирект на /login.
 */

import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/entities/user';
import { env } from '@/shared/config/env';
import { LoadingFallback } from '@/shared/ui';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Если авторизация отключена — пропускаем всех
  if (!env.authEnabled) return <Outlet />;

  if (isLoading) return <LoadingFallback />;
  if (!isAuthenticated)
    return (
      <Navigate
        to="/login"
        replace
      />
    );

  return <Outlet />;
}
