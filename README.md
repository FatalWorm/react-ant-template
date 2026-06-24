# React Template App

Современный шаблон для быстрого старта React-проектов с полной настройкой стека технологий.

## 🚀 Стек технологий

| Категория                | Технология                     |
| ------------------------ | ------------------------------ |
| **Core**                 | React 19, TypeScript           |
| **Архитектура**          | Feature-Sliced Design (FSD)    |
| **Сборка**               | Vite                           |
| **UI Фреймворк**         | Ant Design 5 (Theme Tokens)    |
| **Стилизация**           | styled-components + Ant Tokens |
| **Локализация**          | i18next (ru / en)              |
| **Клиентское состояние** | Zustand + Immer                |
| **Серверное состояние**  | TanStack Query (React Query)   |
| **Роутинг**              | React Router DOM               |
| **Формы**                | React Hook Form + Zod          |
| **HTTP**                 | Ky                             |
| **Даты**                 | Luxon                          |
| **Тесты**                | Vitest + Testing Library       |
| **Линтинг**              | ESLint + Prettier              |
| **Git-хуки**             | Husky + lint-staged            |

## 📁 Структура проекта

Проект построен в соответствии с методологией **Feature-Sliced Design (FSD)** для обеспечения высокой масштабируемости и чистоты архитектуры:

```
src/
├── app/               # Инициализация приложения: провайдеры, роутер, глобальные стили, главный стор
├── pages/             # Страницы приложения (Home, About, Login, Register)
├── widgets/           # Самостоятельные композиционные блоки (MainLayout, Header, Footer)
├── features/          # Пользовательские сценарии и бизнес-логика (Auth, ThemeToggle, LocaleToggle)
├── entities/          # Бизнес-сущности без привязки к логике фичей (User)
└── shared/            # Переиспользуемый код (API, UI-kit, i18n, utils, config, types)
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

| Команда              | Описание                       |
| -------------------- | ------------------------------ |
| `npm run dev`        | Запуск dev-сервера с HMR       |
| `npm run build`      | Сборка для production          |
| `npm run preview`    | Предпросмотр production-сборки |
| `npm run lint`       | Проверка кода ESLint           |
| `npm run format`     | Форматирование кода Prettier   |
| `npm run test`       | Запуск тестов                  |
| `npm run test:watch` | Тесты в watch-режиме           |

## 🔧 Переменные окружения

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
cp .env.example .env
```

| Переменная       | Описание            | По умолчанию                |
| ---------------- | ------------------- | --------------------------- |
| `VITE_API_URL`   | Базовый URL API     | `http://localhost:3000/api` |
| `VITE_APP_TITLE` | Название приложения | `React Template App`        |

## 📄 Лицензия

MIT
