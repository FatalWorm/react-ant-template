/**
 * @module tokenStorage
 * @description CRUD-операции с JWT-токенами в localStorage.
 * Используется httpClient для инъекции Bearer-токена
 * и useUserStore для сохранения/очистки после login/logout.
 */

import type { TAuthTokens } from '@/entities/user/api/user.types';

import { STORAGE_KEYS } from '../keys';
import { ULocalStorage } from '../localStorage.util';

export const tokenStorage = {
  /** Получить access token из localStorage */
  getAccessToken(): string | null {
    return ULocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /** Получить refresh token из localStorage */
  getRefreshToken(): string | null {
    return ULocalStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /** Сохранить оба токена в localStorage */
  setTokens(tokens: TAuthTokens): void {
    ULocalStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    ULocalStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  },

  /** Удалить оба токена из localStorage */
  clearTokens(): void {
    ULocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    ULocalStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /** Проверить наличие хотя бы одного токена */
  hasTokens(): boolean {
    return !!(this.getAccessToken() || this.getRefreshToken());
  },
};
