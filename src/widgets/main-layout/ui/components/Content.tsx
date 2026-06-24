/**
 * @module LayoutContent
 * @description Контентная область MainLayout: адаптивные отступы, минимальная высота viewport.
 */

import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export function LayoutContent() {
  const { token } = theme.useToken();

  return (
    <Content
      style={{
        padding: token.mainLayout.contentPadding,
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Outlet />
    </Content>
  );
}
