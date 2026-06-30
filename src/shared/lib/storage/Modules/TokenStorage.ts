/**
 * @module tokenStorage
 * @description CRUD-операции с JWT-токенами в localStorage.
 * Используется httpClient для инъекции Bearer-токена
 * и useUserStore для сохранения/очистки после login/logout.
 */

import type { TAuthTokens } from '@/Entities/User/Api/user.types';

import { LocalStorage, STORAGE_KEYS } from '..';

export class TokenStorage {
  /** Получить access token из localStorage */
  static getAccessToken(): string | null {
    return LocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /** Получить refresh token из localStorage */
  static getRefreshToken(): string | null {
    return LocalStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /** Сохранить оба токена в localStorage */
  static setTokens(tokens: TAuthTokens): void {
    LocalStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    LocalStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  /** Удалить оба токена из localStorage */
  static clearTokens(): void {
    LocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    LocalStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /** Проверить наличие хотя бы одного токена */
  static hasTokens(): boolean {
    return !!(this.getAccessToken() || this.getRefreshToken());
  }
}
