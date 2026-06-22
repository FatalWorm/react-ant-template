import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { LoadingFallback } from '@/components/LoadingFallback';
import { env } from '@/config/env';

export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Если авторизация отключена — гостевые страницы недоступны
  if (!env.authEnabled) return <Navigate to="/" replace />;

  if (isLoading) return <LoadingFallback />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
