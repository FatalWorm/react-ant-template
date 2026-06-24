import { ULocalStorage } from './localStorage.util';
import { tokenStorage } from './modules/token.storage';

export { STORAGE_KEYS, type TStorageKey } from './keys';

export const Storage = {
  tokens: tokenStorage,
  local: ULocalStorage,
};
