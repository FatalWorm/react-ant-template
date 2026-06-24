import { apiClient } from '../../client';
import type { TExampleItem } from './example.types';

export const exampleApi = {
  async getItems(signal?: AbortSignal): Promise<TExampleItem[]> {
    return apiClient.get('items', { signal }).json<TExampleItem[]>();
  },

  async getItemById(id: number, signal?: AbortSignal): Promise<TExampleItem> {
    return apiClient.get(`items/${id}`, { signal }).json<TExampleItem>();
  },

  async createItem(data: Omit<TExampleItem, 'id'>): Promise<TExampleItem> {
    return apiClient.post('items', { json: data }).json<TExampleItem>();
  },
};
