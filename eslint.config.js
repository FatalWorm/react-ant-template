import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['.husky', 'dist', 'doc', 'public', 'node_modules', '**/*.d.ts', '']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // Автоматически находит ближайший tsconfig.json для каждого файла
        projectService: true,
      },
    },
    rules: {
      // base
      'use-isnan': 'warn',
      'valid-typeof': 'error',
      'no-empty-pattern': 'warn',
      'no-unsafe-finally': 'error',
      'no-use-before-define': 'off',
      'no-unused-private-class-members': 'off',

      // react-hooks
      // Это правило требует, чтобы хуки начинались с "use"
      'react-hooks/rules-of-hooks': 'error',
      // Дополнительное полезное правило для проверки зависимостей
      'react-hooks/exhaustive-deps': 'warn',

      // react-refresh
      'react-refresh/only-export-components': 'off',

      // typescript-eslint
      'no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',

      // ...
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      // Правила именования
      '@typescript-eslint/naming-convention': [
        'error',
        // Типы (T) - PascalCase с префиксом T
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        // Интерфейсы (I) - PascalCase с префиксом I
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        // Классы-утилиты (U) - PascalCase с префиксом U
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          format: ['PascalCase'],
          filter: {
            regex: 'Context$',
            match: true,
          },
        },
        // Стрелочные функции
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        // Обычные переменные
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // React компоненты - PascalCase
        {
          selector: 'function',
          format: ['PascalCase'],
          modifiers: ['exported'],
          filter: {
            regex: '^[A-Z]',
            match: true,
          },
        },
      ],
    },
  },
]);
