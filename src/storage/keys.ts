export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME_MODE: 'theme-mode',
  LOCALE: 'locale',
} as const;

export type TStorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
