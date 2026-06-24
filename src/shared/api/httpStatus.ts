/**
 * @module httpStatus
 * @description Типизированные HTTP-статусы.
 * Используются вместо магических чисел по всему проекту.
 *
 * @example
 * import { HTTP_STATUS } from '@/shared/api/httpStatus';
 * if (response.status === HTTP_STATUS.UNAUTHORIZED) { ... }
 */

export const HTTP_STATUS = {
  // 2xx — Успех
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // 4xx — Ошибка клиента
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx — Ошибка сервера
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type THttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
