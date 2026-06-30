import { Layout } from 'antd';

import { LayoutContent } from './Components/Content';
import { LayoutFooter } from './Components/Footer';
import { LayoutHeader } from './Components/Header';

export function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <LayoutHeader />
      <LayoutContent />
      <LayoutFooter />
    </Layout>
  );
}
