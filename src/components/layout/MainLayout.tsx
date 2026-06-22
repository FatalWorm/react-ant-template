import { Layout, Menu, Button, Select, Space, Typography, theme } from 'antd';
import SunOutlined from '@ant-design/icons/SunOutlined';
import MoonOutlined from '@ant-design/icons/MoonOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { env } from '@/config/env';
import { useAuthStore, useThemeStore } from '@/store';
import { useTranslation, type TLocaleKey, UI18n } from '@/i18n';

const { Header, Content, Footer } = Layout;

export function MainLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const themeMode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const { t, locale, setLocale } = useTranslation();
  const { token } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', label: t.nav.home },
    { key: '/about', label: t.nav.about },
    { key: '/form-demo', label: t.nav.form },
    { key: '/list-demo', label: t.nav.list },
  ];

  return (
    <Layout
      style={{
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
      }}
    >
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: token.marginMD,
          padding: `0 ${token.paddingLG}px`,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Typography.Title
          level={4}
          style={{ margin: 0, whiteSpace: 'nowrap' }}
        >
          {t.common.appName}
        </Typography.Title>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, border: 'none' }}
        />

        <Space>
          {env.i18nEnabled && (
            <Select
              value={locale}
              onChange={(value) => setLocale(value as TLocaleKey)}
              options={UI18n.selectOptions()}
            />
          )}

          <Select
            value={themeMode}
            onChange={(value) => setMode(value)}
            options={[
              {
                value: 'light',
                label: (
                  <>
                    <SunOutlined /> {t.common.lightTheme}
                  </>
                ),
              },
              {
                value: 'dark',
                label: (
                  <>
                    <MoonOutlined /> {t.common.darkTheme}
                  </>
                ),
              },
            ]}
          />

          {env.authEnabled && (
            <Space>
              {user && <Typography.Text type="secondary">{user.name}</Typography.Text>}
              <Button
                danger
                icon={<LogoutOutlined />}
                onClick={logout}
              >
                {t.nav.logout}
              </Button>
            </Space>
          )}
        </Space>
      </Header>

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

      <Footer style={{ textAlign: 'center' }}>
        <Typography.Text type="secondary">{t.common.copyright}</Typography.Text>
      </Footer>
    </Layout>
  );
}
