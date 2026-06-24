import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

/**
 * Типизированная обёртка над useQuery + ky.
 * Автоматически передаёт AbortSignal для отмены запросов.
 *
 * @example
 * const { data, isLoading } = useApiQuery(
 *   queryKeys.examples.list({ page: 1 }),
 *   (signal) => api.get('examples', { signal }).json<IExampleItem[]>()
 * );
 */
export function useApiQuery<T>(
  queryKey: readonly unknown[],
  fetcher: (signal: AbortSignal) => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: ({ signal }) => fetcher(signal),
    ...options,
  });
}
