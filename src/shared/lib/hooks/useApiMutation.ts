/**
 * @module useApiMutation
 * @description React-хук-обёртка над useMutation (TanStack Query) с типизацией ApiResponse.
 */

import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/Shared/Config/QueryClient';

/**
 * Типизированная обёртка над useMutation.
 * Автоматически инвалидирует указанные ключи кэша после успешной мутации.
 *
 * @example
 * const { mutate, isPending } = useApiMutation(
 *   (data: ILoginCredentials) => API.auth.login(data),
 *   { invalidateKeys: [queryKeys.auth.profile()] }
 * );
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables> & {
    invalidateKeys?: readonly (readonly unknown[])[];
  },
) {
  const { invalidateKeys, ...mutationOptions } = options ?? {};

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (...args) => {
      invalidateKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: [...key] }));
      mutationOptions.onSuccess?.(...args);
    },
    ...mutationOptions,
  });
}
