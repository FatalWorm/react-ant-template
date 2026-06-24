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
  // Глобальные исключения: ESLint не будет проверять эти папки и файлы (ускоряет работу линтера)
  globalIgnores(['.husky', 'dist', 'doc', 'public', 'node_modules', '**/*.d.ts', '']),
  {
    // Линтер применяется только к TypeScript файлам
    files: ['**/*.{ts,tsx}'],

    // Подключение базовых наборов правил от разных плагинов
    extends: [
      js.configs.recommended, // Базовые правила JavaScript
      tseslint.configs.recommended, // Рекомендованные правила TypeScript
      reactHooks.configs.flat.recommended, // Правила для хуков React (exhaustive-deps и т.д.)
      reactRefresh.configs.vite, // Правила для корректной работы Hot Module Replacement (HMR) в Vite
    ],

    // Регистрация подключаемых плагинов (позволяет использовать их правила в секции rules)
    plugins: {
      react: reactPlugin, // Базовый плагин React
      'jsx-a11y': jsxA11y, // Проверка доступности (Accessibility) в JSX (например, атрибут alt у картинок)
      'simple-import-sort': simpleImportSort, // Плагин для автоматической сортировки импортов по алфавиту и группам
    },

    // Глобальные настройки
    settings: {
      react: {
        version: '19.2.6', // Явное указание версии React для правильной работы плагинов
      },
    },

    // Настройки языка и окружения
    languageOptions: {
      // Подключение глобальных переменных браузера (window, document) и стандарта ES2021
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        // Автоматически находит ближайший tsconfig.json для каждого файла (нужно для строгих проверок типов)
        projectService: true,
      },
    },

    // Тонкая настройка правил линтера
    rules: {
      // Включаем рекомендованные правила React и JSX
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules, // Позволяет не писать "import React from 'react'" в каждом файле
      ...jsxA11y.configs.recommended.rules, // Включаем все проверки доступности интерфейсов

      // Автоматическая сортировка импортов и экспортов (ошибка, если отсортировано неверно)
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // --- Базовые правила JavaScript ---
      'use-isnan': 'warn', // Предупреждение при прямом сравнении с NaN (нужно использовать Number.isNaN)
      'valid-typeof': 'error', // Ошибка при опечатках в typeof (например: typeof x === 'strnig')
      'no-empty-pattern': 'warn', // Предупреждение при пустой деструктуризации {} = obj
      // Обязательная пустая строка перед return после объявления переменных (улучшает читаемость)
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: 'return' },
      ],
      'no-unsafe-finally': 'error', // Запрет на использование return, throw, break внутри блока finally
      'no-use-before-define': 'off', // Отключаем базовое правило, так как используем улучшенную версию от TypeScript
      'no-unused-private-class-members': 'off',

      // --- Правила для React Hooks ---
      // Строгое соблюдение правил хуков (начинаются с use, вызываются только на верхнем уровне компонента)
      'react-hooks/rules-of-hooks': 'error',
      // Предупреждение, если в массиве зависимостей useEffect/useCallback не хватает переменных
      'react-hooks/exhaustive-deps': 'warn',

      // --- Правила для React Refresh (Vite) ---
      // Отключено: позволяет экспортировать не только компоненты, но и константы/типы из файла
      'react-refresh/only-export-components': 'off',

      // --- Правила TypeScript ---
      'no-unused-vars': 'off', // Отключаем базовое правило в пользу TS версии
      '@typescript-eslint/require-await': 'off', // Разрешаем async функции без await
      '@typescript-eslint/no-unused-vars': 'error', // Ошибка, если объявленная переменная нигде не используется
      '@typescript-eslint/triple-slash-reference': 'off', // Разрешаем комментарии /// <reference />
      '@typescript-eslint/no-explicit-any': 'error', // СТРОГО запрещаем использовать тип 'any' (нужно типизировать всё)
      '@typescript-eslint/no-inferrable-types': 'off', // Разрешаем явно указывать типы, даже если они очевидны (let x: number = 5)
      '@typescript-eslint/no-namespace': 'off', // Разрешаем использование namespaces
      '@typescript-eslint/no-empty-function': 'error', // Запрещаем пустые функции {}
      '@typescript-eslint/no-empty-object-type': 'error', // Запрещаем пустые интерфейсы {}

      // Требуем использовать "import type" для импорта типов (помогает сборщику вычищать типы из итогового JS бандла)
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',

      // --- Строгие правила именования (Naming Conventions) ---
      '@typescript-eslint/naming-convention': [
        'error',
        // 1. Кастомные типы должны быть в PascalCase и начинаться с заглавной буквы 'T' (например: TUser)
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        // 2. Интерфейсы должны быть в PascalCase и начинаться с заглавной буквы 'I' (например: IUser)
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        // 3. Классы должны быть в PascalCase (без префиксов)
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // 4. Переменные, оканчивающиеся на Context (React Context), должны быть строго в PascalCase
        {
          selector: 'variable',
          format: ['PascalCase'],
          filter: {
            regex: 'Context$',
            match: true,
          },
        },
        // 5. Стрелочные функции могут быть camelCase или PascalCase (если это React компонент)
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        // 6. Обычные переменные могут быть camelCase, UPPER_CASE (для констант) или PascalCase
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        // 7. Обычные функции (созданные через function) - строго camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // 8. Экспортируемые функции с большой буквы считаются React-компонентами (должны быть в PascalCase)
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

  // В самом конце подключаем Prettier, чтобы он отключил все правила ESLint, которые могут конфликтовать с внешним форматированием кода
  eslintConfigPrettier,
]);
