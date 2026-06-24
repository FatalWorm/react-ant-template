import { Layout } from 'antd';

import { LayoutContent } from './components/Content';
import { LayoutFooter } from './components/Footer';
import { LayoutHeader } from './components/Header';

export function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <LayoutHeader />
      <LayoutContent />
      <LayoutFooter />
    </Layout>
  );
}
