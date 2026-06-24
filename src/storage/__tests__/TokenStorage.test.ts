import { beforeEach,describe, expect, it } from 'vitest';

import { Storage } from '@/storage';
import { STORAGE_KEYS } from '@/storage';

describe('Storage.tokens (tokenStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('setTokens / getAccessToken / getRefreshToken', () => {
    it('сохраняет и возвращает токены', () => {
      Storage.tokens.setTokens({
        accessToken: 'access_123',
        refreshToken: 'refresh_456',
      });

      expect(Storage.tokens.getAccessToken()).toBe('access_123');
      expect(Storage.tokens.getRefreshToken()).toBe('refresh_456');
    });

    it('возвращает null если токены не установлены', () => {
      expect(Storage.tokens.getAccessToken()).toBeNull();
      expect(Storage.tokens.getRefreshToken()).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('удаляет оба токена из localStorage', () => {
      Storage.tokens.setTokens({
        accessToken: 'access_123',
        refreshToken: 'refresh_456',
      });

      Storage.tokens.clearTokens();

      expect(Storage.tokens.getAccessToken()).toBeNull();
      expect(Storage.tokens.getRefreshToken()).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    function createJwt(payload: Record<string, unknown>): string {
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const body = btoa(JSON.stringify(payload));
      return `${header}.${body}.fake_signature`;
    }

    it('возвращает false для токена с будущим exp', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // +1 час
      const token = createJwt({ exp: futureExp, sub: '1' });

      expect(Storage.tokens.isTokenExpired(token)).toBe(false);
    });

    it('возвращает true для токена с прошедшим exp', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // -1 час
      const token = createJwt({ exp: pastExp, sub: '1' });

      expect(Storage.tokens.isTokenExpired(token)).toBe(true);
    });

    it('возвращает true для токена, истекающего в ближайшие 30 секунд (buffer)', () => {
      const almostExpired = Math.floor(Date.now() / 1000) + 15; // через 15 сек
      const token = createJwt({ exp: almostExpired, sub: '1' });

      expect(Storage.tokens.isTokenExpired(token)).toBe(true);
    });

    it('возвращает false для токена без поля exp', () => {
      const token = createJwt({ sub: '1' });

      expect(Storage.tokens.isTokenExpired(token)).toBe(false);
    });

    it('возвращает true для невалидного токена', () => {
      expect(Storage.tokens.isTokenExpired('not.a.jwt')).toBe(true);
      expect(Storage.tokens.isTokenExpired('')).toBe(true);
    });
  });

  describe('hasValidAccessToken', () => {
    function createJwt(payload: Record<string, unknown>): string {
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const body = btoa(JSON.stringify(payload));
      return `${header}.${body}.fake_signature`;
    }

    it('возвращает true если есть неистёкший access token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      Storage.tokens.setTokens({
        accessToken: createJwt({ exp: futureExp }),
        refreshToken: 'refresh',
      });

      expect(Storage.tokens.hasValidAccessToken()).toBe(true);
    });

    it('возвращает false если access token истёк', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      Storage.tokens.setTokens({
        accessToken: createJwt({ exp: pastExp }),
        refreshToken: 'refresh',
      });

      expect(Storage.tokens.hasValidAccessToken()).toBe(false);
    });

    it('возвращает false если access token отсутствует', () => {
      expect(Storage.tokens.hasValidAccessToken()).toBe(false);
    });
  });

  describe('интеграция с STORAGE_KEYS', () => {
    it('использует правильные ключи в localStorage', () => {
      Storage.tokens.setTokens({
        accessToken: 'acc',
        refreshToken: 'ref',
      });

      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('acc');
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('ref');
    });
  });
});
