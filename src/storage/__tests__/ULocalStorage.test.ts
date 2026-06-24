import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '@/storage';
import { ULocalStorage } from '@/storage/localStorage.util';

describe('ULocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getItem', () => {
    it('возвращает значение из localStorage по зарегистрированному ключу', () => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'test_value');

      expect(ULocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('test_value');
    });

    it('возвращает null если значение не установлено', () => {
      expect(ULocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    });
  });

  describe('setItem', () => {
    it('записывает значение в localStorage', () => {
      ULocalStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'my_token');

      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('my_token');
    });
  });

  describe('removeItem', () => {
    it('удаляет значение из localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'to_delete');

      ULocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    });
  });

  describe('hasItem', () => {
    it('возвращает true если значение существует', () => {
      ULocalStorage.setItem(STORAGE_KEYS.THEME_MODE, 'dark');

      expect(ULocalStorage.hasItem(STORAGE_KEYS.THEME_MODE)).toBe(true);
    });

    it('возвращает false если значение не существует', () => {
      expect(ULocalStorage.hasItem(STORAGE_KEYS.THEME_MODE)).toBe(false);
    });
  });

  describe('isValidKey', () => {
    it('возвращает true для зарегистрированного ключа', () => {
      expect(ULocalStorage.isValidKey(STORAGE_KEYS.ACCESS_TOKEN)).toBe(true);
      expect(ULocalStorage.isValidKey(STORAGE_KEYS.REFRESH_TOKEN)).toBe(true);
      expect(ULocalStorage.isValidKey(STORAGE_KEYS.THEME_MODE)).toBe(true);
    });

    it('возвращает false для незарегистрированного ключа', () => {
      expect(ULocalStorage.isValidKey('unknown_key')).toBe(false);
    });
  });
});
