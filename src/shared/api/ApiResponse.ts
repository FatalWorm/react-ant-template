/**
 * @module ApiResponse
 * @description Типизированная обёртка ответа API.
 * Единая точка парсинга всех ответов сервера.
 *
 * @example
 * const res = await ApiResponse.fromResponse<TUser[]>(response);
 * if (res.isSuccess && res.hasData) {
 *   console.log(res.data);
 * }
 */

import type { TApiErrorCode } from './ErrorCodes';
import type { TResponseMeta } from './ResponseMeta';

export class ApiResponse<T> {
  /** HTTP-статус ответа (200, 201, 404...) */
  readonly statusCode: number;

  /** Бизнес-данные от сервера (null если ошибка) */
  readonly data: T | null;

  /** Сообщение от сервера */
  readonly message: string;

  /** Серверный код ошибки для программной обработки */
  readonly errorCode: TApiErrorCode | null;

  /** Серверная метка времени (ISO 8601) */
  readonly timestamp: string;

  /** Мета-информация (пагинация, rate-limit и т.д.) */
  readonly meta: TResponseMeta | null;

  constructor(params: {
    statusCode: number;
    data?: T | null;
    message?: string;
    errorCode?: TApiErrorCode | null;
    timestamp?: string;
    meta?: TResponseMeta | null;
  }) {
    this.statusCode = params.statusCode;
    this.data = params.data ?? null;
    this.message = params.message ?? '';
    this.errorCode = params.errorCode ?? null;
    this.timestamp = params.timestamp ?? new Date().toISOString();
    this.meta = params.meta ?? null;
  }

  /** Успешный ответ (2xx) */
  get isSuccess(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  /** Ответ содержит данные */
  get hasData(): boolean {
    return this.data !== null;
  }

  /** Ошибка клиента (4xx) */
  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /** Ошибка сервера (5xx) */
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Фабрика: создаёт ApiResponse из Response.
   * Парсит JSON-тело и маппит на поля класса.
   */
  static async fromResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const body = await response.json().catch(() => ({}));

    return new ApiResponse<T>({
      statusCode: response.status,
      data: body.data ?? null,
      message: body.message ?? '',
      errorCode: body.errorCode ?? null,
      timestamp: body.timestamp ?? new Date().toISOString(),
      meta: body.meta ?? null,
    });
  }
}
