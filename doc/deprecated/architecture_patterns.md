# Шаблоны архитектурных решений для React + Ant Design

Данный документ содержит примеры архитектурных подходов, адаптированных под текущий технологический стек проекта.

## Технологический стек проекта

- **Core**: React 19, TypeScript, Vite
- **UI & Styling**: Ant Design (antd), styled-components
- **State Management**: Zustand (клиентское состояние), Immer
- **Data Fetching & Caching**: @tanstack/react-query, ky (HTTP клиент)
- **Forms & Validation**: react-hook-form, zod, @hookform/resolvers
- **Routing**: react-router-dom

---

## Вариант 1: Feature-Sliced Design (FSD) - Рекомендуемый для крупных проектов

FSD — это методология проектирования архитектуры, основанная на разделении приложения на слои, слайсы и сегменты по бизнес-доменам.

### Структура директорий

```text
src/
  app/          # Инициализация приложения (провайдеры, глобальные стили, роутер)
  pages/        # Страницы (композиция фич и сущностей)
  widgets/      # Самостоятельные блоки страницы (например, Header, UserProfileWidget)
  features/     # Бизнес-сценарии (например, UserRegistration, AddToCart)
  entities/     # Бизнес-сущности (например, User, Product) - схемы, сторы, API
  shared/       # Переиспользуемый код (UI-кит поверх antd, утилиты, ky-клиент)
```

### Пример реализации (Авторизация пользователя)

**1. `shared/api/httpClient.ts`** (Настройка ky)

```typescript
import ky from 'ky';

export const httpClient = ky.create({
  prefixUrl: '/api',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('token');
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});
```

**2. `entities/user/model/userSchema.ts`** (Домен: Zod)

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof UserSchema>;
```

**3. `entities/user/model/userStore.ts`** (Состояние: Zustand + Immer)

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from './userSchema';

interface UserState {
  currentUser: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  immer((set) => ({
    currentUser: null,
    setUser: (user) =>
      set((state) => {
        state.currentUser = user;
      }),
  })),
);
```

**4. `features/auth/api/useLogin.ts`** (Асинхронные операции: React Query)

```typescript
import { useMutation } from '@tanstack/react-query';
import { httpClient } from '@/shared/api/httpClient';
import { useUserStore } from '@/entities/user/model/userStore';
import { LoginFormData } from '../model/loginSchema';
import { User } from '@/entities/user/model/userSchema';

export const useLogin = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: LoginFormData) => httpClient.post('login', { json: credentials }).json<User>(),
    onSuccess: (user) => {
      setUser(user);
    },
  });
};
```

**5. `features/auth/ui/LoginForm.tsx`** (UI: react-hook-form + Ant Design + styled-components)

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { loginSchema, LoginFormData } from '../model/loginSchema';
import { useLogin } from '../api/useLogin';

const StyledForm = styled(Form)`
  max-width: 400px;
  margin: 0 auto;
`;

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <StyledForm
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
    >
      <Form.Item
        label="Email"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>
      {/* Поле Password аналогично... */}
      <Button
        type="primary"
        htmlType="submit"
        loading={loginMutation.isPending}
      >
        Войти
      </Button>
    </StyledForm>
  );
};
```

---

## Вариант 2: Модульная (Domain-Driven) архитектура - Оптимально для средних проектов

Более простая альтернатива FSD, где файлы группируются по бизнес-доменам, а внутри делятся по слоям.

### Структура директорий

```text
src/
  core/           # ky, react-query setup, router, глобальные сторы
  shared/         # общие ui компоненты (кнопки, инпуты), утилиты
  modules/
    auth/         # Модуль авторизации
      components/ # LoginForm
      hooks/      # useLogin
      schemas/    # loginSchema
      api/        # authApi
    users/        # Модуль пользователей
      components/
      store/      # userStore
      ...
```

### Преимущества для текущего стека:

- Идеально сочетается с `react-query` — каждый модуль содержит свои хуки для выборки данных.
- Zustand сторы изолируются внутри модулей (состояние пользователя в модуле `users`, настройки в `settings`).
- Схемы `zod` лежат рядом с компонентами форм, которые используют `react-hook-form`.
- Значительно ниже порог вхождения по сравнению с FSD.

---

## Вариант 3: Clean Architecture (Адаптированная для React)

Фокус на строгой независимости бизнес-логики от UI и инфраструктуры.

### Слои

1. **Domain**: Схемы Zod, TypeScript интерфейсы (никаких зависимостей от React или ky).
2. **Application / Use Cases**: Бизнес-логика. В нашем стеке эту роль играют хуки React Query (оркестрация) и Zustand (состояние).
3. **Infrastructure**: Реализация запросов (ky), локальное хранилище.
4. **Presentation**: UI компоненты (React, Ant Design, styled-components).

### Структура директорий

```text
src/
  domain/         # Модели данных (Zod), интерфейсы
  data/           # Сетевые клиенты (ky), репозитории
  application/    # Zustand stores, хуки UseCases (React Query)
  presentation/   # React компоненты, Antd, стили
```

---

## Итоговое заключение (Вывод)

Для текущего технологического стека наиболее выгодной и эффективной является **Вариант 2: Модульная (Domain-Driven) архитектура** с возможностью эволюции в **FSD (Вариант 1)** при значительном росте кодовой базы.

**Обоснование выбора:**

1. **React Query** берет на себя бóльшую часть работы со стейтом (серверное состояние). Это делает традиционные Redux-подобные громоздкие слои излишними. Размещение query-хуков прямо в модулях (`modules/domain/hooks`) обеспечивает идеальную инкапсуляцию.
2. **Zustand** легковесен и может использоваться как для глобального состояния (`src/core/store`), так и для локального состояния фичи (`src/modules/feature/store`).
3. Связка **react-hook-form + zod + Ant Design** отлично работает на уровне компонентов отображения (UI). Инкапсуляция схем валидации (Zod) вместе с компонентом формы внутри одной фичи/модуля повышает переиспользуемость и изолированность кода.
4. Использование **styled-components** поверх Ant Design позволяет локализовать стили внутри компонентов без конфликтов CSS классов.

**Рекомендация:** Начать с модульной структуры (Вариант 2), следя за тем, чтобы модули не ссылались друг на друга напрямую (сохранять слабую связность), а обменивались данными через общий слой (`shared` или `core/store`).
