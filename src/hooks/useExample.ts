import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExampleRepository } from '@/repositories/example.repository';

import { useApiQuery } from './useApiQuery';

// Ключи для кэширования React Query
export const EXAMPLE_KEYS = {
  all: ['examples'] as const,
  lists: () => [...EXAMPLE_KEYS.all, 'list'] as const,
  detail: (id: number) => [...EXAMPLE_KEYS.all, 'detail', id] as const,
};

/**
 * Хук для получения списка элементов.
 * Взаимодействует исключительно с репозиторием.
 */
export function useExampleItems() {
  const { data, isLoading, error, isError } = useApiQuery(
    EXAMPLE_KEYS.lists(),
    (signal) => ExampleRepository.getItems(signal)
  );

  return { 
    items: data ?? [], 
    isLoading, 
    isError,
    error 
  };
}

/**
 * Хук для создания нового элемента.
 */
export function useCreateExampleItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => ExampleRepository.createItem(title),
    onSuccess: () => {
      // Инвалидация кэша после успешного создания для обновления списка
      queryClient.invalidateQueries({ queryKey: EXAMPLE_KEYS.lists() });
    },
  });
}
