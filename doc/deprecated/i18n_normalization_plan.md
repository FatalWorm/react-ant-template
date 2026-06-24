# План нормализации системы интернационализации (i18n)

> **Статус:** Черновик  
> **Создано:** 2026-06-24

---

## Проблемы текущей реализации

### 1. Кастомный велосипед вместо стандартной библиотеки

Текущая система — полностью самописная:

```
I18nProvider (React Context) → useTranslation() → { t: TTranslations }
```

Переводы — это TypeScript-объекты (`ru.ts`, `en.ts`, `be.ts`), которые импортируются целиком в бандл. Нет ни одной стандартной функции: нет интерполяции (`{count}` обрабатывается вручную), нет плюрализации, нет namespace'ов, нет lazy loading словарей.

### 2. Доступ к переводам только через React-хук

`useTranslation()` работает только внутри React-компонентов. **Zustand-сторы, утилиты, API-хелперы** не имеют доступа к текущему языку:

```typescript
// ❌ Store не может использовать useTranslation()
login: async (credentials) => {
  // ...
  state.error = 'Неверный email или пароль'; // ← Хардкод на русском!
};
```

Это привело к тому, что в `useUserStore.ts` все ошибки захардкожены на русском, несмотря на наличие 3 языков.

### 3. Все словари в бандле одновременно

В `i18n.constants.ts`:

```typescript
import { be } from './locales/be';
import { en } from './locales/en';
import { ru } from './locales/ru';
export const LOCALES = { ru, en, be };
```

Все 3 языка импортируются статически → все попадают в основной JS-бандл, даже если пользователь видит только русский.

### 4. Отсутствие интерполяции и плюрализации

Для подстановки переменных используется ручная конкатенация:

```typescript
subtitle: '{count} элементов через react-window...';
// Нет механизма для замены {count} → нужно вручную .replace()
```

Плюрализация (`1 товар / 2 товара / 5 товаров`) вообще не поддерживается.

### 5. Хрупкая типизация через рекурсивные типы

`TDeepStringify<T>` и `TDotPaths<T>` — это рекурсивные типы, которые:

- Замедляют проверку типов на больших словарях
- `TDotPaths` генерирует union ~200+ строк → TS-сервер тормозит
- Не дают автокомплита для `t('key')` — доступ идёт через `t.nav.home` (объектный стиль)

### 6. Дублирование стора локали

Состояние языка хранится **одновременно** в двух местах:

- `useLocaleStore` (Zustand, persist в localStorage) — хранит `locale` + `antLocale`
- `I18nContext` (React Context) — хранит `t`, `locale`, `antLocale`, `setLocale`

`I18nProvider` берёт данные из `useLocaleStore` и прокидывает в Context. Получается бессмысленная прослойка: можно было подписаться на store напрямую.

---

## Целевая архитектура

### Вариант A: Минимальный рефакторинг (оставляем свою систему)

Для проектов, которые не хотят добавлять зависимости.

**Цель:** Устранить проблемы 2, 3, 6 не добавляя библиотек.

| Изменение                                                                      | Что даёт                                               |
| ------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Убрать `I18nContext` + `I18nProvider` → использовать `useLocaleStore` напрямую | Устраняет дублирование, store = single source of truth |
| Добавить `getTranslations()` без хука                                          | Доступ к переводам вне React (store, утилиты)          |
| Lazy import словарей через `await import()`                                    | Убирает 2 из 3 словарей из main bundle                 |
| Добавить функцию `t(key, params?)` с интерполяцией                             | Решает проблему `{count}`                              |

### Вариант B: Миграция на `react-i18next` (рекомендуется)

Для production-проектов, которые будут расти.

**Цель:** Заменить самописную систему на индустриальный стандарт.

| Компонент        | Текущий                    | Целевой                                                  |
| ---------------- | -------------------------- | -------------------------------------------------------- |
| Библиотека       | Самописная                 | `i18next` + `react-i18next`                              |
| Словари          | `.ts` объекты              | `.json` файлы (стандарт)                                 |
| Загрузка         | Все языки сразу            | Lazy через `i18next-http-backend` или `dynamic import()` |
| Интерполяция     | Нет                        | `t('key', { count: 5 })`                                 |
| Плюрализация     | Нет                        | ICU Message Format / встроенная                          |
| Доступ вне React | Нет                        | `i18next.t()` — глобальная функция                       |
| Namespace'ы      | Нет                        | `t('auth:loginTitle')`                                   |
| Ant Design sync  | Ручная через `ANT_LOCALES` | Автоматическая через `i18next.on('languageChanged')`     |
| DevTools         | Нет                        | `i18next-browser-languageDetector`                       |

---

## Детальный план: Вариант B (`react-i18next`)

### Шаг 1. Установка зависимостей

```bash
npm i i18next react-i18next i18next-browser-languagedetector
```

### Шаг 2. Конвертация словарей `.ts` → `.json`

```
src/shared/i18n/locales/
├── ru.json    # Из ru.ts → убрать export/as const/типы
├── en.json
└── be.json
```

Структура ключей остаётся такой же (вложенные объекты), но формат — чистый JSON.

### Шаг 3. Создать `i18n.config.ts`

```typescript
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import be from './locales/be.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      be: { translation: be },
    },
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en', 'be'],
    interpolation: { escapeValue: false }, // React уже экранирует
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'app_locale', // STORAGE_KEYS.LOCALE
    },
  });

export default i18n;
```

### Шаг 4. Обновить `useTranslation` (обратная совместимость)

```typescript
// Реэкспорт для минимизации изменений в компонентах
export { useTranslation } from 'react-i18next';
```

Все компоненты уже импортируют `useTranslation` из `@/shared/i18n/useTranslation` → достаточно заменить реализацию.

### Шаг 5. Обновить использование в компонентах

**До:**

```typescript
const { t } = useTranslation();
return <h1>{t.auth.loginTitle}</h1>;
```

**После:**

```typescript
const { t } = useTranslation();
return <h1>{t('auth.loginTitle')}</h1>;
```

> Это самый трудоёмкий шаг — необходимо пройтись по всем 8 файлам, использующим `useTranslation`.

### Шаг 6. Доступ к переводам вне React

```typescript
// В useUserStore.ts — без хуков:
import i18n from '@/shared/i18n/i18n.config';

state.error = i18n.t(`apiErrors.${err.errorCode}`);
```

Это **главное преимущество** миграции: `i18n.t()` работает где угодно.

### Шаг 7. Синхронизация с Ant Design

```typescript
// В i18n.config.ts или AppProviders:
import { ANT_LOCALES } from './i18n.constants';

i18n.on('languageChanged', (lng) => {
  // Обновляем Ant Design locale
  const antLocale = ANT_LOCALES[lng] ?? ANT_LOCALES['ru'];
  // Передаём через ConfigProvider
});
```

### Шаг 8. Удаление старого кода

Удалить файлы:

- `i18n.context.ts` — заменён на `react-i18next` контекст
- `i18n.provider.tsx` — заменён на `I18nextProvider`
- `i18n.util.ts` (UI18n) — заменён на `i18n.t()`
- `deepStringify.type.ts` — больше не нужен
- `dotPaths.type.ts` — больше не нужен
- `useLocaleStore.ts` — язык теперь управляется через `i18next`

Обновить файлы:

- `i18n.types.ts` — упрощается до re-export типов
- `i18n.constants.ts` — оставить только `ANT_LOCALES`
- `index.ts` — обновить экспорты

### Шаг 9. Типобезопасность (опционально)

Для строгой типизации ключей:

```typescript
// i18n.d.ts
import 'i18next';
import type ru from './locales/ru.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof ru;
    };
  }
}
```

Это даёт автокомплит для `t('auth.loginTitle')` без рекурсивных типов.

---

## Файлы для изменения

| Файл                    | Действие                                             |
| ----------------------- | ---------------------------------------------------- |
| `i18n.config.ts`        | 🆕 Создать (инициализация i18next)                   |
| `i18n.d.ts`             | 🆕 Создать (типизация ключей)                        |
| `locales/ru.json`       | 🆕 Создать (конвертация из .ts)                      |
| `locales/en.json`       | 🆕 Создать                                           |
| `locales/be.json`       | 🆕 Создать                                           |
| `locales/ru.ts`         | ❌ Удалить                                           |
| `locales/en.ts`         | ❌ Удалить                                           |
| `locales/be.ts`         | ❌ Удалить                                           |
| `i18n.context.ts`       | ❌ Удалить                                           |
| `i18n.provider.tsx`     | ❌ Удалить                                           |
| `i18n.util.ts`          | ❌ Удалить                                           |
| `deepStringify.type.ts` | ❌ Удалить                                           |
| `dotPaths.type.ts`      | ❌ Удалить                                           |
| `useLocaleStore.ts`     | ❌ Удалить                                           |
| `useTranslation.ts`     | ✏️ Реэкспорт из react-i18next                        |
| `i18n.constants.ts`     | ✏️ Оставить только ANT_LOCALES                       |
| `i18n.types.ts`         | ✏️ Упростить                                         |
| `index.ts`              | ✏️ Обновить экспорты                                 |
| 8 компонентов           | ✏️ `t.key.nested` → `t('key.nested')`                |
| `useUserStore.ts`       | ✏️ `import i18n` → `i18n.t('apiErrors.CODE')`        |
| `AppProviders`          | ✏️ Убрать `I18nProvider`, добавить `I18nextProvider` |

---

## Чеклист

- [ ] **Шаг 1.** Установить `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- [ ] **Шаг 2.** Конвертировать `.ts` словари → `.json`
- [ ] **Шаг 3.** Создать `i18n.config.ts`
- [ ] **Шаг 4.** Обновить `useTranslation` (реэкспорт)
- [ ] **Шаг 5.** Обновить 8 компонентов: `t.x.y` → `t('x.y')`
- [ ] **Шаг 6.** Обновить `useUserStore`: `i18n.t('apiErrors.CODE')`
- [ ] **Шаг 7.** Синхронизация Ant Design locale
- [ ] **Шаг 8.** Удалить старый код (10 файлов)
- [ ] **Шаг 9.** (Опционально) Типизация через `i18n.d.ts`
- [ ] **Финал.** `npm run tsc` + `npm run test`

---

## Оценка трудозатрат

| Этап                   | Сложность             | Риск регрессии                  |
| ---------------------- | --------------------- | ------------------------------- |
| Установка + конфиг     | Низкая                | Нет                             |
| Конвертация словарей   | Низкая (механическая) | Нет                             |
| Обновление компонентов | Средняя (8 файлов)    | Средний                         |
| Обновление store       | Низкая                | Низкий                          |
| Удаление старого кода  | Низкая                | Высокий (проверить все импорты) |
| **Итого**              | **~2-3 часа**         | **Средний**                     |
