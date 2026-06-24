import type { TAuthTokens } from '@/api/modules/auth/auth.types';

import { STORAGE_KEYS } from '../keys';
import { ULocalStorage } from '../localStorage.util';

export const tokenStorage = {
  getAccessToken(): string | null {
    return ULocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return ULocalStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setTokens(tokens: TAuthTokens): void {
    ULocalStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    ULocalStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  },

  clearTokens(): void {
    ULocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    ULocalStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Декодирует JWT payload (без проверки подписи) и проверяет exp.
   * Возвращает true если токен истёк или невалиден.
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      // Токен истекает, если exp < текущее время (с запасом 30 сек)
      return payload.exp * 1000 < Date.now() + 30_000;
    } catch {
      return true;
    }
  },

  /**
   * Проверяет, есть ли валидный (неистёкший) access token.
   */
  hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  },
};
