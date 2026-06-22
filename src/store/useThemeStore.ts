import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/storage';

type TThemeMode = 'dark' | 'light';

interface IThemeState {
  mode: TThemeMode;
  toggleTheme: () => void;
  setMode: (mode: TThemeMode) => void;
}

export const useThemeStore = create<IThemeState>()(
  persist(
    (set) => ({
      mode: 'dark' as TThemeMode,

      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'dark' ? 'light' : 'dark',
        })),

      setMode: (mode: TThemeMode) => set({ mode }),
    }),
    {
      name: STORAGE_KEYS.THEME_MODE,
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
