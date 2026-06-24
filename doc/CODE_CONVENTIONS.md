# Правила написания кода (Code Conventions)

## Технологический стек

| Категория             | Технология                                  | Назначение                          |
| --------------------- | ------------------------------------------- | ----------------------------------- |
| Ядро                  | React 19, TypeScript 6, Vite 8              | SPA-фреймворк, типизация, сборка    |
| UI-библиотека         | Ant Design 6 (`antd`)                       | Компонентная библиотека             |
| Стилизация            | styled-components                           | Кастомные компоненты вне antd       |
| Клиентский стейт      | Zustand + Immer                             | Глобальное состояние                |
| Серверный стейт / кэш | TanStack React Query                        | Серверные данные, кэширование       |
| HTTP-клиент           | ky                                          | Сетевые запросы                     |
| Формы / валидация     | react-hook-form + Zod + @hookform/resolvers | Управление формами и валидация схем |
| Маршрутизация         | react-router-dom 7                          | SPA-роутинг                         |
| Интернационализация   | Кастомная система (Context + JSON-словари)  | Мультиязычность (ru, en, be)        |
| Даты                  | Luxon                                       | Форматирование и локализация дат    |
| Тестирование          | Vitest + Testing Library + jsdom            | Юнит и smoke-тесты                  |

---

## Архитектура: Feature-Sliced Design (FSD)

Проект организован по методологии [Feature-Sliced Design](https://feature-sliced.design/) — каждый слой имеет строго определённую зону ответственности и правила импорта.

### Структура директорий

```text
src/
├── main.tsx                 # Точка входа: React.StrictMode → <App />
├── App.tsx                  # Композиция: AppProviders + RouterProvider
│
├── app/                     # Слой: Инициализация приложения
│   ├── providers/           # Корневая композиция провайдеров (QueryClient, ConfigProvider, I18n, ErrorBoundary, Suspense)
│   ├── router/              # Маршрутизация: routes, ProtectedRoute, GuestRoute
│   ├── store/               # Глобальные сторы приложения (useThemeStore, useLocaleStore)
│   └── styles/              # Глобальные стили: GlobalStyles (styled-components) + styled.d.ts
│
├── pages/                   # Слой: Страницы (композиция виджетов и фич)
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Login.tsx
│   └── Register.tsx
│
├── widgets/                 # Слой: Самостоятельные блоки UI
│   └── main-layout/         # MainLayout (Header + Content + Footer)
│       ├── index.ts          # Публичный API виджета
│       └── ui/
│           ├── index.tsx     # Компонент MainLayout
│           └── components/   # Header.tsx, Content.tsx, Footer.tsx
│
├── features/                # Слой: Бизнес-сценарии (действия пользователя)
│   ├── auth/                # LoginForm, RegisterForm, LogoutButton
│   └── example/             # Пример структуры фичи
│
├── entities/                # Слой: Бизнес-сущности (данные и логика домена)
│   ├── user/                # Пользователь
│   │   ├── index.ts         # Публичный API: AuthRepository, useUserStore, типы
│   │   ├── api/             # user.api.ts (сетевой слой), user.repository.ts (бизнес-логика), user.types.ts
│   │   └── model/           # useUserStore.ts (Zustand + Immer)
│   └── example/             # Пример структуры сущности
│
├── shared/                  # Слой: Переиспользуемый инфраструктурный код
│   ├── api/                 # httpClient.ts (ky + Bearer + auto-refresh), common.types.ts
│   ├── config/              # env.ts, antTheme.ts, queryClient.ts
│   ├── i18n/                # Кастомная система i18n (Context, Provider, словари, хук useTranslation)
│   ├── lib/                 # Утилиты и хуки
│   │   ├── hooks/           # useApiQuery, useApiMutation, useDebounce, useThrottle
│   │   └── storage/         # ULocalStorage, tokenStorage, STORAGE_KEYS
│   ├── types/               # Утилитарные типы (TDeepStringify, TDotPaths, TNullable, TOptional)
│   └── ui/                  # Базовые UI-компоненты (ErrorBoundary, LoadingFallback, PageWrapper)
│
└── __tests__/               # Глобальные тесты и тестовая инфраструктура
    ├── setup.ts             # Инициализация тестового окружения (@testing-library/jest-dom)
    ├── helpers/             # Вспомогательные утилиты для тестов
    ├── App.test.tsx
    └── Navigation.test.tsx
```

### Правило импортов между слоями

Слои могут импортировать **только из нижестоящих** слоёв:

```text
app → pages → widgets → features → entities → shared
 ↓      ↓        ↓         ↓          ↓         ✕ (shared ни из кого не импортирует)
```

> **Запрещено:** `shared` не может импортировать из `entities`, `entities` не может импортировать из `features` и т.д.

---

## Правила типизации

### Типы (Types)

- **Приставка**: все кастомные типы должны иметь приставку `T`
- **Файлы**: каждый экспортируемый тип выносится в отдельный файл по схеме `typeName.type.ts`
- **Расположение**: `shared/types/` или рядом с модулем

```typescript
// файл: shared/types/nullable.type.ts
export type TNullable<T> = T | null;

// файл: entities/user/api/user.types.ts
export type TUser = { id: string; email: string; name: string; avatar?: string };
```

### Интерфейсы (Interfaces)

- **Приставка**: все интерфейсы должны иметь приставку `I`
- **Файлы**: `interfaceName.interface.ts`

```typescript
export interface IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

### Импорт типов

Все импорты типов **обязательно** должны использовать `import type`:

```typescript
// ✅ Правильно
import type { TUser } from '@/entities/user';

// ❌ Ошибка ESLint
import { TUser } from '@/entities/user';
```

---

## Именование файлов

| Сущность       | Паттерн файла                | Пример                     |
| -------------- | ---------------------------- | -------------------------- |
| Тип            | `typeName.type.ts`           | `nullable.type.ts`         |
| Интерфейс      | `interfaceName.interface.ts` | `apiResponse.interface.ts` |
| Компонент      | `ComponentName.tsx`          | `MainLayout.tsx`           |
| Стили (custom) | `ComponentName.styled.ts`    | `CustomChart.styled.ts`    |
| Контекст       | `name.context.ts`            | `i18n.context.ts`          |
| Провайдер      | `name.provider.tsx`          | `i18n.provider.tsx`        |
| Хук            | `useHookName.ts`             | `useDebounce.ts`           |
| Стор           | `useStoreName.ts`            | `useThemeStore.ts`         |
| API-эндпоинты  | `moduleName.api.ts`          | `user.api.ts`              |
| Репозиторий    | `moduleName.repository.ts`   | `user.repository.ts`       |
| Утилита        | `className.util.ts`          | `localStorage.util.ts`     |
| Константы      | `moduleName.constants.ts`    | `i18n.constants.ts`        |
| Тест           | `ComponentName.test.tsx`     | `App.test.tsx`             |

---

## Утилиты (Utilities)

- **Именование**: классы-утилиты пишутся в `PascalCase` с префиксом `U`
- **Файлы**: `className.util.ts`

```typescript
// файл: shared/lib/storage/localStorage.util.ts
export class ULocalStorage {
  static getItem(key: TStorageKey): string | null { ... }
  static setItem(key: TStorageKey, value: string): void { ... }
}
```

---

## Публичный API модулей (index.ts)

Каждый модуль FSD (сущность, фича, виджет) **обязан** иметь файл `index.ts`, который экспортирует только то, что может быть использовано снаружи. Остальной код модуля считается приватным.

```typescript
// entities/user/index.ts
export { AuthRepository } from './api/user.repository';
export type { TAuthResponse, TAuthTokens, TLoginCredentials, TUser } from './api/user.types';
export { useAuthStore as useUserStore } from './model/useUserStore';
```

> **Правило:** Импортировать из чужого модуля можно **только через `index.ts`**, обращаться напрямую к внутренним файлам модуля запрещено.

---

## Ant Design

- **Основная UI-библиотека** — `antd@6` (`ConfigProvider`, `Layout`, `Menu`, `Form`, `Table`, `Button`, `Card` и др.)
- **Темизация** — через `ConfigProvider` + design tokens (`shared/config/antTheme.ts`), CSS Variables (`cssVar: { prefix: 'ant' }`)
- **Кастомные токены** — расширение `AliasToken` через `declare module` (например, `mainLayout.headerHeight`)
- **Иконки** — `@ant-design/icons@6`, рекомендуется per-file import: `import SunOutlined from '@ant-design/icons/SunOutlined'`
- **Уведомления** — `App.useApp()` → `message.success(...)` / `notification.error(...)`
- **styled-components** остаётся в проекте **только для custom-компонентов**, которые нельзя реализовать средствами antd

### Когда использовать antd vs styled-components

| Задача                                                        | Инструмент                        |
| ------------------------------------------------------------- | --------------------------------- |
| Стандартный UI (кнопки, формы, таблицы, layout)               | `antd`                            |
| Кастомная стилизация antd-компонентов                         | `style` prop + `theme.useToken()` |
| Уникальные визуальные компоненты (графики, кастомные виджеты) | `styled-components`               |

> **Правило:** не дублировать компоненты antd через styled-components.

---

## Общие правила

1. **Один экспортируемый тип/интерфейс = один файл** (для переиспользуемых сущностей).
2. Локальные (неэкспортируемые) типы и интерфейсы допускается оставлять в файле компонента.
3. Приватные styled-компоненты допускается хранить в файле компонента, если файл не превышает ~150 строк. Иначе — выносить в `*.styled.ts`.
4. Все импорты типов должны использовать `import type { ... }`.
5. Запрещено использовать тип `any` — линтер выдаст ошибку `@typescript-eslint/no-explicit-any`.
