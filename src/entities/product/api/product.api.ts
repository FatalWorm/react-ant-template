/**
 * @module product.api
 * @description CRUD-операции для сущности «Товар».
 * Все методы возвращают ApiResponse<T> — типизированную обёртку ответа сервера.
 */

import { ApiResponse } from '@/shared/api';
import { apiClient } from '@/shared/api';

import type { TCreateProduct, TProduct, TUpdateProduct } from './product.types';

export const productApi = {
  /** Получить список всех товаров */
  async getAll(signal?: AbortSignal): Promise<ApiResponse<TProduct[]>> {
    const response = await apiClient.get('products', { signal });

    return ApiResponse.fromResponse<TProduct[]>(response);
  },

  /** Получить товар по ID */
  async getById(id: string, signal?: AbortSignal): Promise<ApiResponse<TProduct>> {
    const response = await apiClient.get(`products/${id}`, { signal });

    return ApiResponse.fromResponse<TProduct>(response);
  },

  /** Создать новый товар */
  async create(data: TCreateProduct): Promise<ApiResponse<TProduct>> {
    const response = await apiClient.post('products', { json: data });

    return ApiResponse.fromResponse<TProduct>(response);
  },

  /** Обновить существующий товар */
  async update(id: string, data: TUpdateProduct): Promise<ApiResponse<TProduct>> {
    const response = await apiClient.patch(`products/${id}`, { json: data });

    return ApiResponse.fromResponse<TProduct>(response);
  },

  /** Удалить товар */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`products/${id}`);
  },
};
