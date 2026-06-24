/**
 * @module httpClient
 * @description Централизованный HTTP-клиент на базе ky.
 *
 * Основные функции:
 * - Автоматическая инъекция Bearer-токена (beforeRequest hook)
 * - Silent Refresh при получении 401 (afterResponse hook)
 * - Race-condition protection: конкурирующие 401-запросы ждут один refresh
 *
 * Для refresh-запроса используется нативный fetch (не ky),
 * чтобы избежать бесконечного цикла в afterResponse hook.
 *
 * @see {@link doc/auth_flow.md} — полная документация потока авторизации
 */

import ky from 'ky';

import { env } from '@/shared/config/env';
import { tokenStorage } from '@/shared/lib/storage/modules/token.storage';

import { ApiError } from './ApiError';
import { API_ERROR_CODES } from './errorCodes';
import { HTTP_STATUS } from './httpStatus';

/** Промис текущего refresh-запроса (singleton для race-condition protection) */
let refreshPromise: Promise<void> | null = null;

/**
 * Обновление пары токенов через refresh token.
 * Использует нативный fetch вместо ky, чтобы запрос не попал
 * в afterResponse hook и не вызвал бесконечный цикл.
 *
 * @throws {ApiError} Если refresh token отсутствует или сервер отклонил запрос
 */
async function refreshTokens(): Promise<void> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new ApiError({
      message: 'No refresh token available',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: API_ERROR_CODES.auth.REFRESH_FAILED,
    });
  }

  const res = await fetch(`${env.apiUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new ApiError({
      message: 'Token refresh failed',
      statusCode: res.status,
      errorCode: API_ERROR_CODES.auth.REFRESH_FAILED,
    });
  }

  const tokens = await res.json();
  tokenStorage.setTokens(tokens);
}

/**
 * Основной HTTP-клиент приложения.
 * Retry отключен — повторные попытки управляются TanStack Query.
 */
export const apiClient = ky.create({
  prefix: env.apiUrl,
  timeout: 30000,
  retry: 0,
  hooks: {
    /**
     * beforeRequest: автоматическая инъекция Bearer-токена.
     * Если access token есть в localStorage — подставляем в заголовок Authorization.
     */
    beforeRequest: [
      ({ request }) => {
        const token = tokenStorage.getAccessToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],

    /**
     * afterResponse: обработка 401 Unauthorized.
     *
     * Алгоритм:
     * 1. Если ответ не 401 — пропускаем.
     * 2. Если refreshPromise ещё нет — запускаем refreshTokens().
     * 3. Если refreshPromise уже есть — ждём его (race-condition protection).
     * 4. После успешного refresh — повторяем оригинальный запрос.
     * 5. Если refresh упал — очищаем токены и редиректим на /login.
     */
    afterResponse: [
      async ({ request, options, response }) => {
        if (response.status !== HTTP_STATUS.UNAUTHORIZED) return response;

        // Все конкурирующие 401-запросы ждут один refresh
        if (!refreshPromise) {
          refreshPromise = refreshTokens().finally(() => {
            refreshPromise = null;
          });
        }

        try {
          await refreshPromise;
        } catch {
          tokenStorage.clearTokens();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return response;
        }

        // Повторяем оригинальный запрос с обновлённым токеном
        // beforeRequest hook автоматически подставит новый токен
        return ky(request, options);
      },
    ],
  },
});
