import type { TApiResponse } from './apiResponse.type';

/**
 * Интерфейс пагинированного API-ответа.
 */
export type TPaginatedResponse<T extends TApiResponse<T[]>> = {
  total: number;
  page: number;
  pageSize: number;
};
