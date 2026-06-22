import { apiClient } from '../client';
import type { IExampleItem } from '@/types/exampleItem.interface';

export const exampleApi = {
  async getItems(signal?: AbortSignal): Promise<IExampleItem[]> {
    return apiClient.get('items', { signal }).json<IExampleItem[]>();
  },

  async getItemById(id: number, signal?: AbortSignal): Promise<IExampleItem> {
    return apiClient.get(`items/${id}`, { signal }).json<IExampleItem>();
  },

  async createItem(data: Omit<IExampleItem, 'id'>): Promise<IExampleItem> {
    return apiClient.post('items', { json: data }).json<IExampleItem>();
  },
};
