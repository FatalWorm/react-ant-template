import { useAuthStore } from '@/entities/user/model/useUserStore';

/**
 * Устанавливает состояние авторизации в сторе для тестов.
 * Вызывать перед render(<App />).
 * Мокает checkAuth чтобы он не сбрасывал состояние.
 */
export function mockAuthenticated() {
  useAuthStore.setState({
    user: { id: '1', email: 'test@mail.ru', name: 'Тест Юзер' },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    checkAuth: async () => {
      // noop — не проверяем токены в тестах
    },
  });
}

/**
 * Устанавливает неавторизованное состояние.
 */
export function mockUnauthenticated() {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    checkAuth: async () => {
      // noop
    },
  });
}
