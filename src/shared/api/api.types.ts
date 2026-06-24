/**
 * @module api.types
 * @description Вспомогательные типы для API-ответов.
 * Используются в ApiResponse для передачи мета-информации.
 */

/** Мета-информация в ответе сервера */
export type TResponseMeta = {
  /** Пагинация */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  /** Rate-limiting (если API возвращает) */
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
};
