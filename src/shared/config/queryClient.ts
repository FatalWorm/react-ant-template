/**
 * @module queryClient
 * @description Глобальный QueryClient для TanStack Query с настройками по умолчанию.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 мин — данные считаются свежими
      gcTime: 10 * 60 * 1000, // 10 мин — кэш живёт после unmount
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
