/**
 * @module AntTheme
 * @description Конфигурация темы Ant Design 5: токены, кастомные компоненты, расширенные алиасы.
 */

import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import type { AliasToken } from 'antd/es/theme/interface';

type TThemeMode = 'dark' | 'light';

declare module 'antd/es/theme/interface' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface AliasToken {
    mainLayout: {
      headerHeight: number;
      footerHeight: number;
      contentPadding: number;
    };
  }
}

/** Общие токены — разделяемые между dark и light */
const sharedTokens: Partial<AliasToken> = {
  mainLayout: {
    headerHeight: 64,
    footerHeight: 70,
    contentPadding: 24,
  },
};

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
