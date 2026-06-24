import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintConfigPrettier from 'eslint-config-prettier';
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
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: {
        version: '19.2.6',
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        // Автоматически находит ближайший tsconfig.json для каждого файла
        projectService: true,
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...jsxA11y.configs.recommended.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

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
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Правила именования
      '@typescript-eslint/naming-convention': [
        'error',
        // Типы (T) - PascalCase с префиксом T
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        // Интерфейсы (I) - PascalCase с префиксом I
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        // Классы (утилиты и др.) - PascalCase
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
  eslintConfigPrettier,
]);
