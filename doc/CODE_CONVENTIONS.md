# Правила написания кода (Code Conventions)

## Типы (Types)

- **Приставка**: все типы должны иметь приставку `T`
- **Файлы**: каждый экспортируемый тип выносится в отдельный файл по схеме `typeName.type.ts`
- **Расположение**: `src/types/`

### Примеры

```typescript
// файл: src/types/nullable.type.ts
export type TNullable<T> = T | null;

// файл: src/types/themeMode.type.ts
export type TThemeMode = 'dark' | 'light';

// файл: src/types/formData.type.ts
type TFormData = z.infer<typeof formSchema>;
```

---

## Интерфейсы (Interfaces)

- **Приставка**: все интерфейсы должны иметь приставку `I`
- **Файлы**: каждый экспортируемый интерфейс выносится в отдельный файл по схеме `interfaceName.interface.ts`
- **Расположение**: `src/types/` или рядом с модулем, к которому интерфейс относится

### Примеры

```typescript
// файл: src/types/apiResponse.interface.ts
export interface IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// файл: src/store/appState.interface.ts
export interface IAppState {
  sidebarOpen: boolean;
}
```

---

## Утилиты (Utilities)

- **Именование**: классы-утилиты пишутся в `PascalCase`
- **Файлы**: каждый экспортируемый утилитарный класс выносится в отдельный файл по схеме `className.util.ts`

### Примеры

```typescript
// файл: src/utils/localStorage.util.ts
export class LocalStorage {
  static getItem() {}
}
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
| Провайдер      | `NameProvider.tsx`           | `I18nProvider.tsx`         |
| Хук            | `useHookName.ts`             | `useDebounce.ts`           |
| Стор           | `useStoreName.ts`            | `useAppStore.ts`           |
| API-модуль     | `moduleName.api.ts`          | `auth.api.ts`              |
| Утилита        | `className.util.ts`          | `localStorage.util.ts`     |
| Тест           | `ComponentName.test.tsx`     | `App.test.tsx`             |

---

## Общие правила

1. **Один экспортируемый тип/интерфейс = один файл** (для переиспользуемых сущностей).
2. Локальные (неэкспортируемые) типы и интерфейсы допускается оставлять в файле компонента.
3. Приватные styled-компоненты допускается хранить в файле компонента, если файл не превышает ~150 строк. Иначе — выносить в `*.styled.ts`.
4. Все импорты типов должны использовать `import type { ... }`.

---

## Ant Design

- **Основная UI-библиотека** — `antd@6` (`ConfigProvider`, `Layout`, `Menu`, `Form`, `Table`, `Button`, `Card` и др.)
- **Темизация** — через `ConfigProvider` с design tokens (`src/config/antTheme.ts`), CSS Variables (`cssVar: {}`)
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
