/**
 * Общий интерфейс API-ответа.
 */
export interface IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
