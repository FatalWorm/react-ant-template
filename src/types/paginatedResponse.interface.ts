import type { IApiResponse } from './apiResponse.interface';

/**
 * Интерфейс пагинированного API-ответа.
 */
export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
