import ky from 'ky';

import { env } from '@/shared/config/env';
import { Storage } from '@/shared/lib/storage';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Отдельный инстанс ky для refresh-запроса.
 * Не содержит afterResponse hook, чтобы избежать бесконечного цикла.
 */
const authClient = ky.create({
  timeout: 15000,
  retry: 0,
});

export const apiClient = ky.create({
  prefix: env.apiUrl,
  timeout: 30000,
  retry: 0, // retry управляется TanStack Query
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = Storage.tokens.getAccessToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, options, response }) => {
        if (response.status !== 401) return response;

        // Запускаем refresh только один раз, остальные запросы ждут
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              const refreshToken = Storage.tokens.getRefreshToken();
              if (!refreshToken) throw new Error('No refresh token');

              const newTokens = await authClient
                .post(`${env.apiUrl}/auth/refresh`, {
                  json: { refreshToken },
                })
                .json<{ accessToken: string; refreshToken: string }>();

              Storage.tokens.setTokens(newTokens);
            } catch {
              Storage.tokens.clearTokens();
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
              throw new Error('Token refresh failed');
            } finally {
              isRefreshing = false;
              refreshPromise = null;
            }
          })();
        }

        try {
          await refreshPromise;
        } catch {
          // Если refresh упал — не повторяем запрос, пусть 401 пробросится
          return response;
        }

        // Повторяем оригинальный запрос с обновлённым токеном
        // beforeRequest hook автоматически подставит новый токен
        return apiClient(request, options);
      },
    ],
  },
});
