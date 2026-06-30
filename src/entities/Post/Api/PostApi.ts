import { apiClient, ApiResponse } from '@/Shared/Api';

import type { TPostRaw } from '../Models';

export class PostApi {
  static async getAll(signal?: AbortSignal): Promise<ApiResponse<TPostRaw[]>> {
    const response = await apiClient.get('products', { signal });

    return ApiResponse.fromResponse<TPostRaw[]>(response);
  }
}
