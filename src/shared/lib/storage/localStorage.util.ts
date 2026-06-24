/**
 * @module ULocalStorage
 * @description Типобезопасная обёртка над localStorage с поддержкой JSON-сериализации.
 */

import { STORAGE_KEYS, type TStorageKey } from './keys';

export class ULocalStorage {
  /**
   * Проверяет, зарегистрирован ли ключ в словаре STORAGE_KEYS
   */
  static isValidKey(key: string): key is TStorageKey {
    return Object.values(STORAGE_KEYS).includes(key as TStorageKey);
  }

  static getItem(key: TStorageKey): string | null {
    if (!this.isValidKey(key)) {
      console.warn(`[LocalStorage] Попытка чтения неизвестного ключа: ${key}`);
      return null;
    }
    return localStorage.getItem(key);
  }

  static setItem(key: TStorageKey, value: string): void {
    if (!this.isValidKey(key)) {
      console.warn(`[LocalStorage] Попытка записи по неизвестному ключу: ${key}`);
      return;
    }
    localStorage.setItem(key, value);
  }

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
