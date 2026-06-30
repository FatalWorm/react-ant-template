/**
 * @module product.queryKeys
 * @description Фабрика ключей запросов для сущности Product.
 *
 * Иерархия:
 *   productKeys.all         → ['products']                — инвалидирует ВСЁ
 *   productKeys.lists()     → ['products', 'list']        — инвалидирует все списки
 *   productKeys.list(params)→ ['products', 'list', {...}]  — конкретный список
 *   productKeys.details()   → ['products', 'detail']      — инвалидирует все детали
 *   productKeys.detail(id)  → ['products', 'detail', id]  — конкретный товар
 *
 * @example
 * // Инвалидировать все списки после создания товара:
 * invalidateKeys: [productKeys.lists()]
 *
 * // Инвалидировать конкретный товар после обновления:
 * invalidateKeys: [productKeys.detail(id)]
 */

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
