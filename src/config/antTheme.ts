import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

type TThemeMode = 'dark' | 'light';

/** Общие токены — разделяемые между dark и light */
const sharedTokens = {};

const darkConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  cssVar: {},
  token: {
    ...sharedTokens,
  },
};

const lightConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  cssVar: {},
  token: {
    ...sharedTokens,
  },
};

const themeConfigs: Record<TThemeMode, ThemeConfig> = {
  dark: darkConfig,
  light: lightConfig,
};

export function getAntTheme(mode: TThemeMode): ThemeConfig {
  return themeConfigs[mode];
}

export type { TThemeMode };
