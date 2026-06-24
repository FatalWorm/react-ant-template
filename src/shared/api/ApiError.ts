/**
 * @module ApiError
 * @description Типизированная ошибка API.
 * Расширяет стандартный Error, добавляя HTTP-статус и серверный код ошибки.
 * Позволяет проверять тип ошибки через `instanceof ApiError` и метод `error.is()`.
 *
 * @example
 * try {
 *   await authApi.login(credentials);
 * } catch (err) {
 *   if (err instanceof ApiError && err.is(API_ERROR_CODES.auth.INVALID_CREDENTIALS)) {
 *     showToast('Неверный email или пароль');
 *   }
 * }
 */

import { API_ERROR_CODES, type TApiErrorCode } from './errorCodes';

export class ApiError extends Error {
  /** HTTP-статус (401, 404, 500...) */
  readonly statusCode: number;

  /** Типизированный серверный код ошибки */
  readonly errorCode: TApiErrorCode;

  /** Оригинальное тело ответа от сервера (для отладки) */
  readonly details: unknown;

  constructor(params: { message: string; statusCode: number; errorCode: TApiErrorCode; details?: unknown }) {
    super(params.message);
    this.name = 'ApiError';
    this.statusCode = params.statusCode;
    this.errorCode = params.errorCode;
    this.details = params.details ?? null;
  }

  /**
   * Фабрика: создаёт ApiError из Response.
   * Парсит JSON-тело ответа и извлекает message, errorCode.
   */
  static async fromResponse(response: Response): Promise<ApiError> {
    const body = await response.json().catch(() => ({}));

    return new ApiError({
      message: body.message ?? `Request failed with status ${response.status}`,
      statusCode: response.status,
      errorCode: body.errorCode ?? API_ERROR_CODES.server.INTERNAL,
      details: body,
    });
  }

  /**
   * Проверка конкретного кода ошибки.
   * @example err.is(API_ERROR_CODES.auth.TOKEN_EXPIRED)
   */
  is(code: TApiErrorCode): boolean {
    return this.errorCode === code;
  }
}
