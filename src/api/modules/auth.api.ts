import { apiClient } from '../client';
import type { ILoginCredentials } from '@/types/loginCredentials.interface';
import type { IRegisterCredentials } from '@/types/registerCredentials.interface';
import type { IAuthTokens } from '@/types/authTokens.interface';
import type { IUser } from '@/types/user.interface';
import type { TAuthResponse } from '@/types/authResponse.type';

export const authApi = {
  async login(credentials: ILoginCredentials): Promise<TAuthResponse> {
    return apiClient.post('auth/login', { json: credentials }).json<TAuthResponse>();
  },

  async register(credentials: IRegisterCredentials): Promise<TAuthResponse> {
    return apiClient.post('auth/register', { json: credentials }).json<TAuthResponse>();
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('auth/logout');
    } catch {
      // Игнорируем ошибку — токены всё равно будут удалены на клиенте
    }
  },

  async refreshToken(refreshToken: string): Promise<IAuthTokens> {
    return apiClient
      .post('auth/refresh', { json: { refreshToken } })
      .json<IAuthTokens>();
  },

  async getProfile(signal?: AbortSignal): Promise<IUser> {
    return apiClient.get('auth/profile', { signal }).json<IUser>();
  },
};
