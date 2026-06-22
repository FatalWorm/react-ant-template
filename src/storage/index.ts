import { tokenStorage } from './modules/token.storage';
import { ULocalStorage } from './localStorage.util';

export const Storage = {
  tokens: tokenStorage,
  local: ULocalStorage,
};

export { STORAGE_KEYS } from './keys';
export type { TStorageKey } from './keys';
