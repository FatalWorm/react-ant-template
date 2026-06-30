/**
 * @module useUserStore
 * @description Zustand-стор авторизации (Immer для иммутабельных обновлений).
 *
 * Управляет состоянием пользователя и предоставляет действия:
 * - login / register: аутентификация с сохранением токенов
 * - logout: очистка токенов и состояния (с вызовом серверного logout)
 * - checkAuth: проверка сессии при инициализации приложения
 *
 * Обработка ошибок типизирована через ApiError и API_ERROR_CODES.
 * Все сообщения об ошибках локализованы через i18n.t().
 *
 * @see {@link doc/auth_flow.md} — полная документация потока авторизации
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { AuthApi } from '@/Entities/User/Api/user.api';
import type { TLoginCredentials, TRegisterCredentials, TUser } from '@/Entities/User/Api/user.types';

import { ApiError } from '@/Shared/Api';
import { API_ERROR_CODES } from '@/Shared/Api';
import { t } from '@/Shared/I18n';
import { Storage } from '@/Shared/Lib/Storage';

/**
 * Возвращает локализованное сообщение для ApiError.
 * Ищет код ошибки в словаре `apiErrors.*`, при отсутствии — fallback.
 */
function getApiErrorMessage(
  err: ApiError,
  fallbackKey: 'errors.loginFailed' | 'errors.registerFailed' | 'errors.somethingWentWrong',
): string {
  if (err.errorCode) {
    const key = `apiErrors.${err.errorCode}`;
    // Ключ строится динамически — типизация невозможна, каст безопасен
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translated = t(key as any) as string;
    // Если i18next не нашёл ключ — вернётся сам ключ; тогда используем fallback
    if (translated !== key) return translated;
  }
  return t(fallbackKey);
}

type TAuthState = {
  // Состояние
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Действия
  login: (credentials: TLoginCredentials) => Promise<void>;
  register: (credentials: TRegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: TUser) => void;
  clearError: () => void;
};

export const useAuthStore = create<TAuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // true по умолчанию — checkAuth ещё не завершён
    error: null,

    /**
     * Вход: отправляет credentials → сохраняет токены → обновляет состояние.
     * При ошибке переводит errorCode в локализованное сообщение.
     */
    login: async (credentials) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await AuthApi.login(credentials);

        if (!response.isSuccess || !response.data) {
          throw new ApiError({
            message: response.message || t('errors.loginFailed'),
            statusCode: response.statusCode,
            errorCode: response.errorCode ?? API_ERROR_CODES.server.INTERNAL,
          });
        }

        Storage.tokens.setTokens(response.data.tokens);

        set((state) => {
          state.user = response.data!.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (err) {
        set((state) => {
          state.isLoading = false;
          if (err instanceof ApiError) {
            state.error = getApiErrorMessage(err, 'errors.loginFailed');
          } else {
            state.error = t('errors.loginFailed');
          }
        });
        throw err;
      }
    },

    /**
     * Регистрация: отправляет credentials → сохраняет токены → обновляет состояние.
     * При ошибке переводит errorCode в локализованное сообщение.
     */
    register: async (credentials) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await AuthApi.register(credentials);

        if (!response.isSuccess || !response.data) {
          throw new ApiError({
            message: response.message || t('errors.registerFailed'),
            statusCode: response.statusCode,
            errorCode: response.errorCode ?? API_ERROR_CODES.server.INTERNAL,
          });
        }

        Storage.tokens.setTokens(response.data.tokens);

        set((state) => {
          state.user = response.data!.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (err) {
        set((state) => {
          state.isLoading = false;
          if (err instanceof ApiError) {
            state.error = getApiErrorMessage(err, 'errors.registerFailed');
          } else {
            state.error = t('errors.registerFailed');
          }
        });
        throw err;
      }
    },

    /**
     * Выход: вызывает серверный logout → очищает токены и состояние.
     * Даже если серверный запрос упадёт, токены будут очищены (finally).
     */
    logout: async () => {
      try {
        await AuthApi.logout();
      } finally {
        Storage.tokens.clearTokens();
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        });
      }
    },

    /**
     * Проверка сессии при инициализации приложения.
     * 1. Нет токенов → не авторизован.
     * 2. Есть токены → загружаем профиль.
     *    Если access token протух — afterResponse hook в httpClient
     *    автоматически обновит его через refresh token и повторит запрос.
     */
    checkAuth: async () => {
      if (!Storage.tokens.hasTokens()) {
        set((state) => {
          state.isLoading = false;
          state.isAuthenticated = false;
        });
        return;
      }

      try {
        const response = await AuthApi.getProfile();

        if (!response.isSuccess || !response.data) {
          throw new Error('Profile fetch failed');
        }

        set((state) => {
          state.user = response.data!;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch {
        Storage.tokens.clearTokens();
        set((state) => {
          state.isLoading = false;
          state.isAuthenticated = false;
        });
      }
    },

    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),

    clearError: () =>
      set((state) => {
        state.error = null;
      }),
  })),
);
