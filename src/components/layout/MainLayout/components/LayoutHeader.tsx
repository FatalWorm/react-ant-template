import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import MoonOutlined from '@ant-design/icons/MoonOutlined';
import SunOutlined from '@ant-design/icons/SunOutlined';
import { Button, Layout, Menu, Select, Space, theme,Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { env } from '@/config/env';
import type { TLocaleKey } from '@/i18n/i18n.types';
import { UI18n } from '@/i18n/i18n.util';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthStore, useThemeStore } from '@/store';

const { Header } = Layout;

export function LayoutHeader() {
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
  );
}
