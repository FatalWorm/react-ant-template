import { authApi } from '@/entities/user/api/user.api';
import type { TLoginCredentials, TRegisterCredentials, TUser } from '@/entities/user/api/user.types';
import { Storage } from '@/shared/lib/storage';

/**
 * Репозиторий для работы с авторизацией.
 * Выступает связующим звеном между сетевым слоем (API) и локальными сервисами (Storage).
 * Инкапсулирует бизнес-логику работы с токенами и возвращает только необходимые для UI данные (TUser).
 */
export class AuthRepository {
  /**
   * Авторизация пользователя. Сохраняет токены в Storage и возвращает профиль.
   */
  static async login(credentials: TLoginCredentials): Promise<TUser> {
    const response = await authApi.login(credentials);
    Storage.tokens.setTokens(response.tokens);
    return response.user;
  }

  /**
   * Регистрация пользователя. Сохраняет токены в Storage и возвращает профиль.
   */
  static async register(credentials: TRegisterCredentials): Promise<TUser> {
    const response = await authApi.register(credentials);
    Storage.tokens.setTokens(response.tokens);
    return response.user;
  }

  /**
   * Выход из системы. Сообщает API и очищает локальное хранилище.
   */
  static async logout(): Promise<void> {
    await authApi.logout();
    Storage.tokens.clearTokens();
  }

  /**
   * Получение профиля текущего пользователя.
   */
  static async getProfile(): Promise<TUser> {
    return authApi.getProfile();
  }

  /**
   * Проверка наличия токенов в локальном хранилище (быстрая синхронная проверка).
   */
  static hasTokens(): boolean {
    const accessToken = Storage.tokens.getAccessToken();
    const refreshToken = Storage.tokens.getRefreshToken();
    return !!(accessToken || refreshToken);
  }

  /**
   * Очистка токенов (например, при недействительной сессии).
   */
  static clearTokens(): void {
    Storage.tokens.clearTokens();
  }
}
