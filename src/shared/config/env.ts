/**
 * @module env
 * @description Переменные окружения приложения, типизированные через Vite import.meta.env.
 */

export const env = {
  // Базовые
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  // API
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  // APP
  appTitle: import.meta.env.VITE_APP_TITLE ?? 'React Template App',
  // Feature Flags
  authEnabled: import.meta.env.VITE_AUTH_ENABLED === 'true', // false по умолчанию
  i18nEnabled: import.meta.env.VITE_I18N_ENABLED === 'true', // false по умолчанию
} as const;
