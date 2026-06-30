/**
 * @module ResponseMeta
 * @description Вспомогательные типы для API-ответов.
 * Инкапсулирует структуру мета-информации (такую как пагинация и rate-limiting),
 * используемую в унифицированных ответах сервера (ApiResponse).
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
