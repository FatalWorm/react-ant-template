export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  appTitle: import.meta.env.VITE_APP_TITLE ?? 'React Template App',
  authEnabled: import.meta.env.VITE_AUTH_ENABLED !== 'false', // true по умолчанию
  i18nEnabled: import.meta.env.VITE_I18N_ENABLED === 'true', // false по умолчанию
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

