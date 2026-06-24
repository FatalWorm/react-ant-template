import { apiClient } from '@/shared/api/httpClient';

import type { TAuthResponse, TAuthTokens, TLoginCredentials, TRegisterCredentials, TUser } from './user.types';

export const authApi = {
  async login(credentials: TLoginCredentials): Promise<TAuthResponse> {
    return apiClient.post('auth/login', { json: credentials }).json<TAuthResponse>();
  },

  async register(credentials: TRegisterCredentials): Promise<TAuthResponse> {
    return apiClient.post('auth/register', { json: credentials }).json<TAuthResponse>();
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('auth/logout');
    } catch {
      // Игнорируем ошибку — токены всё равно будут удалены на клиенте
    }
  },

  async refreshToken(refreshToken: string): Promise<TAuthTokens> {
    return apiClient.post('auth/refresh', { json: { refreshToken } }).json<TAuthTokens>();
  },

  async getProfile(signal?: AbortSignal): Promise<TUser> {
    return apiClient.get('auth/profile', { signal }).json<TUser>();
  },
};
