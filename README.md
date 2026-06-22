# React Template App

Современный шаблон для быстрого старта React-проектов с полной настройкой стека технологий.

## 🚀 Стек технологий

| Категория | Технология |
|---|---|
| Core | React 19, TypeScript |
| Сборка | Vite |
| UI Фреймворк | Ant Design |
| Стилизация | styled-components |
| Клиентское состояние | Zustand + Immer |
| Серверное состояние | React Query |
| Роутинг | React Router DOM |
| Формы | React Hook Form + Zod |
| HTTP | Ky |
| Даты | Luxon |
| Тесты | Vitest + Testing Library |
| Линтинг | ESLint + Prettier |
| Git-хуки | Husky + lint-staged |

## 📁 Структура проекта

```
src/
├── __tests__/         # Общие тесты, моки и хелперы
├── api/               # Слой API (ky инстанс, эндпоинты)
├── components/        # Переиспользуемые UI-компоненты
│   └── layout/        # Layout-компоненты (MainLayout, Header)
├── config/            # Конфигурация приложения (env.ts)
├── hooks/             # Кастомные хуки (useDebounce и т.д.)
├── i18n/              # Конфигурация локализации и переводы
├── pages/             # Страницы (HomePage, AboutPage, и др.)
├── router/            # Настройка роутинга
├── storage/           # Управление локальным хранилищем (токены, настройки)
├── store/             # Zustand-сторы
├── styles/            # Тема, глобальные стили, типы styled-components
├── types/             # Общие TypeScript-типы
└── utils/             # Утилиты (форматирование дат и т.д.)
```

## ⚡ Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Предпросмотр production-сборки
npm run preview
```

## 📋 Доступные скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера с HMR |
| `npm run build` | Сборка для production |
| `npm run preview` | Предпросмотр production-сборки |
| `npm run lint` | Проверка кода ESLint |
| `npm run format` | Форматирование кода Prettier |
| `npm run test` | Запуск тестов |
| `npm run test:watch` | Тесты в watch-режиме |

## 🔧 Переменные окружения

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
cp .env.example .env
```

| Переменная | Описание | По умолчанию |
|---|---|---|
| `VITE_API_URL` | Базовый URL API | `http://localhost:3000/api` |
| `VITE_APP_TITLE` | Название приложения | `React Template App` |

## 📄 Лицензия

MIT
