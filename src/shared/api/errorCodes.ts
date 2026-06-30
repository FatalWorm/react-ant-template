/**
 * @module ErrorCodes
 * @description Серверные коды ошибок, сгруппированные по бизнес-доменам.
 * Должны быть синхронизированы с бэкенд-контрактом.
 *
 * Для добавления нового кода:
 * 1. Определите домен (auth, validation, resource, server, network)
 * 2. Добавьте код в соответствующую группу
 * 3. Используйте формат: ДОМЕН_ДЕЙСТВИЕ (например: AUTH_TOKEN_EXPIRED)
 * 4. Тип TApiErrorCode обновится автоматически
 *
 * @example
 * import { API_ERROR_CODES } from '@/Shared/Api/errorCodes';
 * if (err.is(API_ERROR_CODES.auth.INVALID_CREDENTIALS)) { ... }
 */

export const API_ERROR_CODES = {
  /** Аутентификация и авторизация */
  auth: {
    UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
    REFRESH_FAILED: 'AUTH_REFRESH_FAILED',
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
    ACCOUNT_NOT_VERIFIED: 'AUTH_ACCOUNT_NOT_VERIFIED',
  },

  /** Валидация входных данных */
  validation: {
    INVALID_INPUT: 'VALIDATION_INVALID_INPUT',
    EMAIL_ALREADY_EXISTS: 'VALIDATION_EMAIL_ALREADY_EXISTS',
    WEAK_PASSWORD: 'VALIDATION_WEAK_PASSWORD',
    FIELD_REQUIRED: 'VALIDATION_FIELD_REQUIRED',
  },

  /** Операции с ресурсами */
  resource: {
    NOT_FOUND: 'RESOURCE_NOT_FOUND',
    ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
    CONFLICT: 'RESOURCE_CONFLICT',
  },

  /** Серверные ошибки */
  server: {
    INTERNAL: 'SERVER_INTERNAL',
    UNAVAILABLE: 'SERVER_UNAVAILABLE',
    RATE_LIMITED: 'SERVER_RATE_LIMITED',
  },

  /** Сетевые ошибки (клиентские, не от сервера) */
  network: {
    TIMEOUT: 'NETWORK_TIMEOUT',
    CONNECTION_REFUSED: 'NETWORK_CONNECTION_REFUSED',
    UNKNOWN: 'NETWORK_UNKNOWN',
  },
} as const;

/** Извлекаем union всех строковых значений из вложенного объекта */
type TValues<T> = T extends Record<string, infer V> ? (V extends string ? V : TValues<V>) : never;

/** Тип: один из допустимых кодов ошибки */
export type TApiErrorCode = TValues<typeof API_ERROR_CODES>;
