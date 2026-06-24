import { Navigate, Outlet } from 'react-router-dom';

import { useUserStore } from '@/entities/user';
import { env } from '@/shared/config/env';
import { LoadingFallback } from '@/shared/ui/LoadingFallback';

export function ProtectedRoute() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const isLoading = useUserStore((s) => s.isLoading);

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
