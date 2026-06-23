/**
 * Общий интерфейс API-ответа.
 */
export type TApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};
