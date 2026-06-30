/**
 * @module Storage
 * @description Централизованный доступ к модулям работы с локальным хранилищем.
 */
import { TokenStorage } from './Modules/TokenStorage';

/**
 * Словарь допустимых ключей для использования в localStorage.
 * Предотвращает опечатки и использование нетипизированных строк.
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME_MODE: 'theme-mode',
  LOCALE: 'locale',
} as const;

/**
 * Тип допустимых ключей localStorage, полученный из словаря STORAGE_KEYS.
 */
export type TStorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * @class ULocalStorage
 * @description Утилитарный класс для типобезопасной работы с localStorage.
 * Гарантирует использование только зарегистрированных ключей.
 */
export class LocalStorage {
  /**
   * Проверяет, зарегистрирован ли ключ в словаре STORAGE_KEYS.
   */
  static isValidKey(key: string): key is TStorageKey {
    return Object.values(STORAGE_KEYS).includes(key as TStorageKey);
  }

  /**
   * Получает значение из localStorage по ключу.
   * Возвращает null и выводит предупреждение в консоль при использовании неизвестного ключа.
   */
  static getItem(key: TStorageKey): string | null {
    if (!this.isValidKey(key)) {
      console.warn(`[LocalStorage] Попытка чтения неизвестного ключа: ${key}`);
      return null;
    }
    return localStorage.getItem(key);
  }

  /**
   * Сохраняет значение в localStorage по ключу.
   * Выводит предупреждение в консоль при использовании неизвестного ключа.
   */
  static setItem(key: TStorageKey, value: string): void {
    if (!this.isValidKey(key)) {
      console.warn(`[LocalStorage] Попытка записи по неизвестному ключу: ${key}`);
      return;
    }
    localStorage.setItem(key, value);
  }

  /**
   * Удаляет значение из localStorage по заданному ключу.
   * Выводит предупреждение в консоль при использовании неизвестного ключа.
   */
  static removeItem(key: TStorageKey): void {
    if (!this.isValidKey(key)) {
      console.warn(`[LocalStorage] Попытка удаления неизвестного ключа: ${key}`);
      return;
    }
    localStorage.removeItem(key);
  }

  /**
   * Проверяет, существует ли значение для данного ключа в localStorage
   */
  static hasItem(key: TStorageKey): boolean {
    return this.getItem(key) !== null;
  }
}

/**
 * Глобальный объект для удобного доступа ко всем подсистемам хранилища.
 */
export const Storage = {
  tokens: TokenStorage,
  local: LocalStorage,
};
