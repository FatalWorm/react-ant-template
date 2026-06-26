// Утилита для приведения всех точных литералов ("Главная") к общему типу string.
// Это нужно для того, чтобы другие словари (например, en.ts) могли подставлять свой текст.
export type TDeepStringify<T> = {
  [K in keyof T]: T[K] extends object ? TDeepStringify<T[K]> : string;
};
