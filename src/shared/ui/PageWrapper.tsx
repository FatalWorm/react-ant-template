/**
 * @module PageWrapper
 * @description Обёртка страниц: центрирование контента, анимация появления, адаптивные отступы.
 */

import { Flex, type FlexProps, theme } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export type TPageWrapperProps = {
  children: ReactNode;
  maxWidth?: number | string;
  style?: CSSProperties;
} & Omit<FlexProps, 'children' | 'style'>;

export function PageWrapper({ children, maxWidth = '100%', style, ...rest }: TPageWrapperProps) {
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        padding: '24px',
        minHeight: '100%',
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        animation: 'pageFadeIn 0.4s ease-out forwards',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Flex>
  );
}
