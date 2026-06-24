import { Layout } from 'antd';

import { LayoutContent } from './components/LayoutContent';
import { LayoutFooter } from './components/LayoutFooter';
import { LayoutHeader } from './components/LayoutHeader';

export function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <LayoutHeader />
      <LayoutContent />
      <LayoutFooter />
    </Layout>
  );
}

