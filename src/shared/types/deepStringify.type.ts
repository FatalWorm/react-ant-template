/**
 * Рекурсивно заменяет все литеральные строки на `string`,
 * сохраняя структуру ключей.
 */
export type TDeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : TDeepStringify<T[K]>;
};
