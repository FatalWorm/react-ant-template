/**
 * Рекурсивный тип для получения всех dot-path ключей из объекта.
 */
export type TDotPaths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${TDotPaths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;