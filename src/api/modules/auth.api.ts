import { apiClient } from '../client';
import type { TLoginCredentials } from '@/types/loginCredentials.type';
import type { TRegisterCredentials } from '@/types/registerCredentials.type';
import type { TAuthTokens } from '@/types/authTokens.type';
import type { TUser } from '@/types/user.type';
import type { TAuthResponse } from '@/types/authResponse.type';

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
    return apiClient
      .post('auth/refresh', { json: { refreshToken } })
      .json<TAuthTokens>();
  },

  async getProfile(signal?: AbortSignal): Promise<TUser> {
    return apiClient.get('auth/profile', { signal }).json<TUser>();
  },
};
