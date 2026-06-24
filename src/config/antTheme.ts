import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

type TThemeMode = 'dark' | 'light';

/** Общие токены — разделяемые между dark и light */
const sharedTokens: ThemeConfig['token'] = {};

const darkConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  cssVar: { prefix: 'ant' },
  token: {
    ...sharedTokens,
  },
};

const lightConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  cssVar: { prefix: 'ant' },
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
