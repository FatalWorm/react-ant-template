/**
 * Общий интерфейс API-ответа.
 */
export type TApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

/**
 * Интерфейс пагинированного API-ответа.
 */
export type TPaginatedResponse<T extends TApiResponse<T[]>> = {
  total: number;
  page: number;
  pageSize: number;
};
