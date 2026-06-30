/**
 * @module ProductApi
 * @description CRUD-операции для сущности «Товар».
 * Все методы возвращают ApiResponse<T> — типизированную обёртку ответа сервера.
 */

import { apiClient, ApiResponse } from '@/Shared/Api';

import type { TCreateProduct, TProduct, TUpdateProduct } from '../Model';

export class ProductApi {
  /** Получить список всех товаров */
  static async getAll(signal?: AbortSignal): Promise<ApiResponse<TProduct[]>> {
    const response = await apiClient.get('products', { signal });

    return ApiResponse.fromResponse<TProduct[]>(response);
  }

  /** Получить товар по ID */
  static async getById(id: string, signal?: AbortSignal): Promise<ApiResponse<TProduct>> {
    const response = await apiClient.get(`products/${id}`, { signal });

    return ApiResponse.fromResponse<TProduct>(response);
  }

  /** Создать новый товар */
  static async create(data: TCreateProduct): Promise<ApiResponse<TProduct>> {
    const response = await apiClient.post('products', { json: data });

    return ApiResponse.fromResponse<TProduct>(response);
  }

  /** Обновить существующий товар */
  static async update(id: string, data: TUpdateProduct): Promise<ApiResponse<TProduct>> {
    const response = await apiClient.patch(`products/${id}`, { json: data });

    return ApiResponse.fromResponse<TProduct>(response);
  }

  /** Удалить товар */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`products/${id}`);
  }
}
