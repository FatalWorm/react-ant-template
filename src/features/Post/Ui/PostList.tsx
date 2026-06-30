import CaretLeftOutlined from '@ant-design/icons/CaretLeftOutlined';
import { Layout, Typography } from 'antd';

import { useAppTranslation } from '@/Shared/I18n';

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

function PostList() {
  const { t } = useAppTranslation();

  return (
    <Layout>
      <Header>
        <Title level={2}>{t('nav.posts')}</Title>
      </Header>

      <Layout>
        <Sider
          collapsedWidth={0}
          collapsible
          defaultCollapsed={false}
          trigger={<CaretLeftOutlined />}
          width="350px"
        >
          Sider
        </Sider>

        <Content>Content</Content>
      </Layout>

      <Footer>Footer</Footer>
    </Layout>
  );
}

export default PostList;
