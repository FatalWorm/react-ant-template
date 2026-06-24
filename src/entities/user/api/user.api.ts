/**
 * @module user.api
 * @description Сетевой слой сущности «Пользователь».
 * Все методы возвращают ApiResponse<T> — типизированную обёртку ответа сервера.
 */

import { ApiResponse } from '@/shared/api';
import { apiClient } from '@/shared/api';

import type { TAuthResponse, TAuthTokens, TLoginCredentials, TRegisterCredentials, TUser } from './user.types';

export const authApi = {
  /** Вход по email + пароль → ApiResponse с данными пользователя и токенами */
  async login(credentials: TLoginCredentials): Promise<ApiResponse<TAuthResponse>> {
    const response = await apiClient.post('auth/login', { json: credentials });

    return ApiResponse.fromResponse<TAuthResponse>(response);
  },

  /** Регистрация → ApiResponse с данными пользователя и токенами */
  async register(credentials: TRegisterCredentials): Promise<ApiResponse<TAuthResponse>> {
    const response = await apiClient.post('auth/register', { json: credentials });

    return ApiResponse.fromResponse<TAuthResponse>(response);
  },

  /** Выход — инвалидация refresh token на сервере */
  async logout(): Promise<void> {
    try {
      await apiClient.post('auth/logout');
    } catch {
      // Игнорируем ошибку — токены всё равно будут удалены на клиенте
    }
  },

  /** Обновление пары токенов */
  async refreshToken(refreshToken: string): Promise<ApiResponse<TAuthTokens>> {
    const response = await apiClient.post('auth/refresh', { json: { refreshToken } });

    return ApiResponse.fromResponse<TAuthTokens>(response);
  },

  /** Получение профиля текущего пользователя */
  async getProfile(signal?: AbortSignal): Promise<ApiResponse<TUser>> {
    const response = await apiClient.get('auth/profile', { signal });

    return ApiResponse.fromResponse<TUser>(response);
  },
};
