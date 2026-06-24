import { Navigate, Outlet } from 'react-router-dom';

import { LoadingFallback } from '@/components/LoadingFallback';
import { env } from '@/config/env';
import { useAuthStore } from '@/store';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Если авторизация отключена — пропускаем всех
  if (!env.authEnabled) return <Outlet />;

  if (isLoading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
