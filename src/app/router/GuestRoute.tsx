import { Navigate, Outlet } from 'react-router-dom';

import { useUserStore } from '@/entities/user';
import { env } from '@/shared/config/env';
import { LoadingFallback } from '@/shared/ui/LoadingFallback';

export function GuestRoute() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const isLoading = useUserStore((s) => s.isLoading);

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
