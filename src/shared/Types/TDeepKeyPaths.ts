/**
 * Получает все вложенные ключи объекта, включая вложенные свойства.
 * Возвращает.union типа всех возможных путей к вложенным свойствам.
 *
 * @template ObjectType - Тип объекта, для которого нужно получить ключи
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 *   address: {
 *     city: string;
 *     street: string;
 *   };
 * }
 *
 * type UserKeys = TNestedKeyOf<User>;
 * // Результат: "id" | "name" | "address" | "address.city" | "address.street"
 * ```
 */
export type TDeepKeyPaths<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${TDeepKeyPaths<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
