/**
 * @module LayoutContent
 * @description Контентная область MainLayout: адаптивные отступы, минимальная высота viewport.
 */

import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

export function LayoutContent() {
  return (
    <Content>
      <Outlet />
    </Content>
  );
}
