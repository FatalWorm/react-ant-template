import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/store';

// Мокаем Репозиторий
vi.mock('@/repositories/auth.repository', () => ({
  AuthRepository: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
    hasTokens: vi.fn(),
    clearTokens: vi.fn(),
  },
}));

import { AuthRepository } from '@/repositories/auth.repository';

const mockedRepository = vi.mocked(AuthRepository, { deep: true });

describe('useAuthStore', () => {
  beforeEach(() => {
    // Сбрасываем стор в начальное состояние
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('начальное состояние', () => {
    it('user = null, isAuthenticated = false', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('login', () => {
    it('при успешном логине обновляет user и isAuthenticated', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@mail.com' };
      mockedRepository.login.mockResolvedValue(mockUser);

      await useAuthStore.getState().login({ email: 'test@mail.com', password: '123456' });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(mockedRepository.login).toHaveBeenCalledWith({ email: 'test@mail.com', password: '123456' });
    });

    it('при ошибке логина устанавливает error', async () => {
      mockedRepository.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        useAuthStore.getState().login({ email: 'bad@mail.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('очищает user, isAuthenticated и вызывает logout репозитория', () => {
      // Устанавливаем аутентифицированное состояние
      useAuthStore.setState({
        user: { id: '1', name: 'Test', email: 'test@mail.com' },
        isAuthenticated: true,
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(mockedRepository.logout).toHaveBeenCalled();
    });
  });

  describe('checkAuth', () => {
    it('если нет токенов — isAuthenticated = false', async () => {
      mockedRepository.hasTokens.mockReturnValue(false);

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(mockedRepository.getProfile).not.toHaveBeenCalled();
    });

    it('если есть токены — загружает профиль', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@mail.com' };
      mockedRepository.hasTokens.mockReturnValue(true);
      mockedRepository.getProfile.mockResolvedValue(mockUser);

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('если getProfile падает — очищает токены', async () => {
      mockedRepository.hasTokens.mockReturnValue(true);
      mockedRepository.getProfile.mockRejectedValue(new Error('401'));

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(mockedRepository.clearTokens).toHaveBeenCalled();
    });
  });

  describe('clearError', () => {
    it('сбрасывает error в null', () => {
      useAuthStore.setState({ error: 'Some error' });

      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('setUser', () => {
    it('обновляет user', () => {
      const newUser = { id: '2', name: 'New', email: 'new@mail.com' };

      useAuthStore.getState().setUser(newUser);

      expect(useAuthStore.getState().user).toEqual(newUser);
    });
  });
});
