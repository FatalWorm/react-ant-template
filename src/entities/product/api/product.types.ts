/**
 * @module product.types
 * @description Типы сущности «Товар».
 * Эталонный пример типизации CRUD-сущности в проекте.
 */

/** Товар, возвращаемый с сервера */
export type TProduct = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

/** Данные для создания товара */
export type TCreateProduct = {
  name: string;
  price: number;
};

/** Данные для обновления товара (partial) */
export type TUpdateProduct = Partial<TCreateProduct>;
