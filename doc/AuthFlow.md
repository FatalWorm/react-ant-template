# Поток авторизации (Auth Flow)

Данный документ описывает архитектуру системы аутентификации:
как происходит вход, выход, проверка сессии и автоматическое обновление токенов.

---

## Общая схема: Кто за что отвечает

| Файл                 | Слой FSD      | Ответственность                                        |
| -------------------- | ------------- | ------------------------------------------------------ |
| `httpClient.ts`      | shared/api    | Инъекция Bearer-токена, silent refresh при 401         |
| `tokenStorage`       | shared/lib    | CRUD-операции с access/refresh токенами в localStorage |
| `user.api.ts`        | entities/user | Сетевые запросы: login, register, logout, getProfile   |
| `useUserStore.ts`    | entities/user | Zustand-стор: состояние юзера + бизнес-логика auth     |
| `ProtectedRoute.tsx` | app/router    | Route guard: редирект на /login если не авторизован    |
| `GuestRoute.tsx`     | app/router    | Reverse guard: редирект на / если уже авторизован      |
| `env.ts`             | shared/config | Feature flag `VITE_AUTH_ENABLED`                       |

---

## Диаграмма 1: Инициализация приложения (checkAuth)

Вызывается один раз при монтировании `AppProviders`.

```mermaid
flowchart TD
    A["App монтируется"] --> B{"Есть токены<br/>в localStorage?"}
    B -- Нет --> C["isAuthenticated = false<br/>isLoading = false"]
    B -- Да --> D["GET /auth/profile"]
    D -- 200 OK --> E["user = response<br/>isAuthenticated = true"]
    D -- 401 --> F["afterResponse hook"]
    F --> G["refreshTokens()"]
    G -- Успех --> H["Повтор GET /auth/profile"]
    H --> E
    G -- Ошибка --> I["clearTokens()<br/>redirect → /login"]
    D -- "Другая ошибка" --> J["clearTokens()<br/>isAuthenticated = false"]
```

---

## Диаграмма 2: Вход (login)

```mermaid
sequenceDiagram
    participant U as Пользователь
    participant F as LoginForm
    participant S as useUserStore
    participant A as authApi
    participant T as tokenStorage
    participant R as Router

    U->>F: Вводит email + пароль
    F->>S: login(credentials)
    S->>A: authApi.login(credentials)
    A-->>S: { user, tokens }
    S->>T: tokenStorage.setTokens(tokens)
    S->>S: set({ user, isAuthenticated: true })
    R->>R: ProtectedRoute → Outlet
```

---

## Диаграмма 3: Silent Refresh (автоматическое обновление токена)

```mermaid
sequenceDiagram
    participant C as apiClient (ky)
    participant H as afterResponse hook
    participant F as fetch (нативный)
    participant S as Сервер
    participant T as tokenStorage

    C->>S: GET /api/data (Bearer: expired_token)
    S-->>C: 401 Unauthorized
    C->>H: response.status === 401

    alt refreshPromise === null
        H->>F: POST /auth/refresh { refreshToken }
        F->>S: POST /auth/refresh
        S-->>F: { accessToken, refreshToken }
        F->>T: tokenStorage.setTokens(newTokens)
    else refreshPromise уже есть
        H->>H: await существующий refreshPromise
    end

    H->>C: Повтор оригинального запроса
    Note right of C: beforeRequest hook<br/>подставляет новый токен
    C->>S: GET /api/data (Bearer: new_token)
    S-->>C: 200 OK + данные
```

> **Почему `fetch`, а не `ky`?** Запрос на refresh не должен попадать в `afterResponse` hook `apiClient`, иначе получим бесконечный цикл: refresh → 401 → refresh → 401 → ...

> **Race-condition protection:** Если 3 запроса одновременно получают 401, только первый запускает `refreshTokens()`. Остальные два ждут (`await refreshPromise`) тот же промис.

---

## Диаграмма 4: Маршрутизация (Route Guards)

```mermaid
flowchart TD
    A["Пользователь запрашивает URL"] --> B{"VITE_AUTH_ENABLED<br/>= true?"}
    B -- Нет --> C["Пропустить всех"]
    B -- Да --> D{"isLoading?"}
    D -- Да --> E["LoadingFallback<br/>(спиннер)"]
    D -- Нет --> F{"Тип маршрута?"}

    F -- ProtectedRoute --> G{"isAuthenticated?"}
    G -- Да --> H["Outlet<br/>(показать страницу)"]
    G -- Нет --> I["redirect → /login"]

    F -- GuestRoute --> J{"isAuthenticated?"}
    J -- Да --> K["redirect → /"]
    J -- Нет --> L["Outlet<br/>(показать LoginPage)"]
```

---

## Feature Flag: `VITE_AUTH_ENABLED`

Если `VITE_AUTH_ENABLED=false` (по умолчанию):

- `ProtectedRoute` пропускает всех без проверки
- `GuestRoute` перенаправляет на `/` (страницы Login/Register недоступны)
- `checkAuth` всё равно вызывается, но быстро завершается (нет токенов → `isLoading=false`)

---

## Обработка ошибок

Все ошибки API типизированы через класс `ApiError`.
Коды ошибок сгруппированы по доменам в `API_ERROR_CODES`:

| Домен        | Примеры кодов                                                          |
| ------------ | ---------------------------------------------------------------------- |
| `auth`       | `AUTH_UNAUTHORIZED`, `AUTH_INVALID_CREDENTIALS`, `AUTH_ACCOUNT_LOCKED` |
| `validation` | `VALIDATION_EMAIL_ALREADY_EXISTS`, `VALIDATION_WEAK_PASSWORD`          |
| `resource`   | `RESOURCE_NOT_FOUND`, `RESOURCE_CONFLICT`                              |
| `server`     | `SERVER_INTERNAL`, `SERVER_UNAVAILABLE`                                |
| `network`    | `NETWORK_TIMEOUT`, `NETWORK_CONNECTION_REFUSED`                        |

### Пример обработки в store

```typescript
try {
  const response = await authApi.login(credentials);
  tokenStorage.setTokens(response.tokens);
} catch (err) {
  if (err instanceof ApiError) {
    if (err.is(API_ERROR_CODES.auth.INVALID_CREDENTIALS)) {
      state.error = 'Неверный email или пароль';
    } else if (err.is(API_ERROR_CODES.auth.ACCOUNT_LOCKED)) {
      state.error = 'Аккаунт заблокирован';
    }
  }
}
```

### Пример обработки в компоненте

```typescript
const { error } = useApiQuery(productKeys.lists(), (signal) =>
  productApi.getAll(signal),
);

if (error instanceof ApiError && error.is(API_ERROR_CODES.resource.NOT_FOUND)) {
  return <Result status="404" title="Товары не найдены" />;
}
```
