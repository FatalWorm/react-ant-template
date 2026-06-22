import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/store';

// Мокаем API и Storage
vi.mock('@/api', () => ({
  API: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getProfile: vi.fn(),
    },
  },
}));

vi.mock('@/storage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/storage')>();
  return {
    ...actual,
    Storage: {
      ...actual.Storage,
      tokens: {
        getAccessToken: vi.fn(() => null),
        getRefreshToken: vi.fn(() => null),
        setTokens: vi.fn(),
        clearTokens: vi.fn(),
      },
    },
  };
});

// Импортируем моки после vi.mock
import { API } from '@/api';
import { Storage } from '@/storage';

const mockedAPI = vi.mocked(API, { deep: true });
const mockedStorage = vi.mocked(Storage, { deep: true });

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
      mockedAPI.auth.login.mockResolvedValue({
        user: mockUser,
        tokens: { accessToken: 'acc', refreshToken: 'ref' },
      });

      await useAuthStore.getState().login({ email: 'test@mail.com', password: '123456' });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(mockedStorage.tokens.setTokens).toHaveBeenCalledWith({
        accessToken: 'acc',
        refreshToken: 'ref',
      });
    });

    it('при ошибке логина устанавливает error', async () => {
      mockedAPI.auth.login.mockRejectedValue(new Error('Invalid credentials'));

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
    it('очищает user, isAuthenticated и вызывает clearTokens', () => {
      // Устанавливаем аутентифицированное состояние
      useAuthStore.setState({
        user: { id: '1', name: 'Test', email: 'test@mail.com' },
        isAuthenticated: true,
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(mockedStorage.tokens.clearTokens).toHaveBeenCalled();
      expect(mockedAPI.auth.logout).toHaveBeenCalled();
    });
  });

  describe('checkAuth', () => {
    it('если нет токенов — isAuthenticated = false', async () => {
      mockedStorage.tokens.getAccessToken.mockReturnValue(null);
      mockedStorage.tokens.getRefreshToken.mockReturnValue(null);

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(mockedAPI.auth.getProfile).not.toHaveBeenCalled();
    });

    it('если есть access token — загружает профиль', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@mail.com' };
      mockedStorage.tokens.getAccessToken.mockReturnValue('valid_token');
      mockedStorage.tokens.getRefreshToken.mockReturnValue('refresh_token');
      mockedAPI.auth.getProfile.mockResolvedValue(mockUser);

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('если есть только refresh token — всё равно пробует загрузить профиль', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@mail.com' };
      mockedStorage.tokens.getAccessToken.mockReturnValue(null);
      mockedStorage.tokens.getRefreshToken.mockReturnValue('refresh_token');
      mockedAPI.auth.getProfile.mockResolvedValue(mockUser);

      await useAuthStore.getState().checkAuth();

      expect(mockedAPI.auth.getProfile).toHaveBeenCalled();
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('если getProfile падает — очищает токены', async () => {
      mockedStorage.tokens.getAccessToken.mockReturnValue('expired_token');
      mockedStorage.tokens.getRefreshToken.mockReturnValue(null);
      mockedAPI.auth.getProfile.mockRejectedValue(new Error('401'));

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(mockedStorage.tokens.clearTokens).toHaveBeenCalled();
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
