import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { TUser } from '@/types/user.type';
import type { TLoginCredentials } from '@/types/loginCredentials.type';
import type { TRegisterCredentials } from '@/types/registerCredentials.type';
import { API } from '@/api';
import { Storage } from '@/storage';

type TAuthState = {
  // Состояние
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Действия
  login: (credentials: TLoginCredentials) => Promise<void>;
  register: (credentials: TRegisterCredentials) => Promise<void>;
  logout: () => void;
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

    login: async (credentials) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await API.auth.login(credentials);
        Storage.tokens.setTokens(response.tokens);

        set((state) => {
          state.user = response.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (err) {
        set((state) => {
          state.isLoading = false;
          state.error = err instanceof Error ? err.message : 'Ошибка авторизации';
        });
        throw err;
      }
    },

    register: async (credentials) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await API.auth.register(credentials);
        Storage.tokens.setTokens(response.tokens);

        set((state) => {
          state.user = response.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (err) {
        set((state) => {
          state.isLoading = false;
          state.error = err instanceof Error ? err.message : 'Ошибка регистрации';
        });
        throw err;
      }
    },

    logout: () => {
      API.auth.logout();
      Storage.tokens.clearTokens();

      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
    },

    checkAuth: async () => {
      const accessToken = Storage.tokens.getAccessToken();
      const refreshToken = Storage.tokens.getRefreshToken();

      // Нет ни одного токена — не авторизован
      if (!accessToken && !refreshToken) {
        set((state) => {
          state.isLoading = false;
          state.isAuthenticated = false;
        });
        return;
      }

      // Загружаем профиль.
      // Если access token протух — afterResponse hook в client.ts
      // автоматически обновит его через refresh token и повторит запрос.
      try {
        const user = await API.auth.getProfile();
        set((state) => {
          state.user = user;
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
