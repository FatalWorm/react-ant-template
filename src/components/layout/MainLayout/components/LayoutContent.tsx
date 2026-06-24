import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export function LayoutContent() {
  const { token } = theme.useToken();

  return (
    <Content
      style={{
        padding: token.paddingLG,
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Outlet />
    </Content>
  );
}
