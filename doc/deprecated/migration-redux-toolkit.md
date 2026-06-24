# Миграция с Zustand на Redux Toolkit

Этот план описывает процесс замены менеджера состояний `zustand` (включая плагины `immer` и `persist`) на связку `@reduxjs/toolkit`, `react-redux` и `redux-persist`.

## Proposed Changes

---

### Dependencies

Обновление пакетов и зависимостей в `package.json`.

#### [MODIFY] `package.json`

- Удаление `zustand` и `immer` (т.к. `immer` встроен в Redux Toolkit).
- Добавление `@reduxjs/toolkit`, `react-redux`, `redux-persist` и `@types/redux-persist`.

---

### Redux Store & Slices

Создание структуры стора и слайсов для Redux Toolkit.

#### [NEW] `src/store/store.ts`

Инициализация Redux store с помощью `configureStore`. Настройка `combineReducers` и оборачивание необходимых редьюсеров (тема, локаль) в `persistReducer` с использованием `localStorage` (`redux-persist`).

#### [NEW] `src/store/hooks.ts`

Создание типизированных хуков `useAppDispatch` и `useAppSelector` на основе `RootState` и `AppDispatch`.

#### [NEW] `src/store/slices/authSlice.ts`

Создание слайса аутентификации.

- Использование `createAsyncThunk` для асинхронных операций: `login`, `register`, `checkAuth`.
- Синхронные редьюсеры: `setUser`, `clearError`, `logout`.

#### [NEW] `src/store/slices/themeSlice.ts`

Создание слайса для управления темой.

- Редьюсеры `toggleTheme`, `setMode`.
- Состояние будет сохраняться через `redux-persist`.

#### [NEW] `src/store/slices/localeSlice.ts`

Создание слайса для локализации (выбор языка).

- Редьюсер `setLocale`.
- Состояние будет сохраняться через `redux-persist`.

#### [DELETE] `src/store/useAuthStore.ts`

Удаление старого Zustand стора авторизации.

#### [DELETE] `src/store/useThemeStore.ts`

Удаление старого Zustand стора тем.

#### [DELETE] `src/store/useLocaleStore.ts`

Удаление старого Zustand стора локализации.

---

### Application Providers

Интеграция Redux-провайдеров в корень приложения.

#### [MODIFY] `src/main.tsx`

- Добавление `<Provider store={store}>` из `react-redux`.
- Добавление `<PersistGate loading={null} persistor={persistor}>` из `redux-persist`.

---

### Components & Hooks Updates

Замена старых хуков `use*Store` на `useAppSelector` и `useAppDispatch` во всех компонентах.

#### [MODIFY] `src/pages/LoginPage/LoginForm.tsx`

#### [MODIFY] `src/pages/RegisterPage/RegisterForm.tsx`

Замена `useAuthStore` на вызовы `useAppDispatch` для `login` / `register` и `useAppSelector` для чтения ошибок и статуса загрузки.

#### [MODIFY] `src/router/ProtectedRoute.tsx`

#### [MODIFY] `src/router/GuestRoute.tsx`

Подписка на `isAuthenticated` и `isLoading` через `useAppSelector(state => state.auth)`.

#### [MODIFY] `src/pages/HomePage/HomePage.tsx`

#### [MODIFY] `src/i18n/I18nProvider.tsx`

Замена `useLocaleStore` на `useAppSelector(state => state.locale)` и `useAppDispatch` для смены локали.

#### [MODIFY] `src/components/layout/Header.tsx`

Обновление управления темой, авторизацией и локалью с Zustand хуков на RTK.

#### [MODIFY] Locales (`be.ts`, `en.ts`, `ru.ts`)

Обновление текстовок на главной странице/странице "О нас", где упоминается "Zustand + Immer", на "Redux Toolkit".

---

### Tests

Внесение правок в существующие тесты для обеспечения их совместимости с Redux Toolkit. Существующие тесты не удаляются, а модифицируются под новый менеджер состояний.

#### [MODIFY] `src/store/__tests__/useAuthStore.test.ts` (переименовать в `authSlice.test.ts`)

Исправление логики тестирования аутентификации. Вместо вызовов `getState()` из Zustand, тесты будут использовать локальный Redux store для проверки изменения состояния при вызове `dispatch(login(...))` и других экшенов.

#### [MODIFY] `src/__tests__/helpers/authHelpers.ts`

Замена `useAuthStore.setState` на моканье initial state в Redux Provider или диспатч соответствующих экшенов для инициализации состояния в тестах.

## Verification Plan

### Automated Tests

- Запуск всех юнит-тестов: `npm run test`
- Проверка линтера и типизации: `npm run lint && npm run build`

### Manual Verification

- **Авторизация**: Проверить флоу логина, регистрации, логаута, и обновление `checkAuth` при перезагрузке страницы.
- **Локализация**: Изменить язык приложения, перезагрузить страницу и убедиться, что язык восстановился (сохранен в LocalStorage через `redux-persist`).
- **Тема**: Переключить на светлую/темную тему, перезагрузить страницу, убедиться, что тема сохранилась.
