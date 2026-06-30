/**
 * @module ProtectedRoute
 * @description Защищённый маршрут: требует авторизации. Неавторизованных — редирект на /login.
 */

import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/Entities/User';

import { env } from '@/Shared/Config/Env';
import { LoadingFallback } from '@/Shared/Ui';

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
