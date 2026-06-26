/**
 * @module LayoutHeader
 * @description Шапка приложения: навигация, переключатель языка и темы, кнопка выхода.
 */

import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import MoonOutlined from '@ant-design/icons/MoonOutlined';
import SunOutlined from '@ant-design/icons/SunOutlined';
import { Button, Layout, Menu, Select, Space, theme, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useThemeStore } from '@/app/store';
import { useAuthStore } from '@/entities/user';
import { env } from '@/shared/config/env';
import { SUPPORTED_LANGS, useAppTranslation } from '@/shared/i18n';

const { Header } = Layout;

export function LayoutHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const themeMode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const { t, i18n } = useAppTranslation();
  const { token } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', label: t('nav.home') },
    { key: '/about', label: t('nav.about') },
  ];

  const languageOptions = SUPPORTED_LANGS.map((key) => ({
    value: key,
    label: key === 'ru' ? 'Русский' : key === 'en' ? 'English' : 'Беларуский',
  }));

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: token.marginMD,
        padding: `0 ${token.paddingLG}px`,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        height: token.mainLayout.headerHeight,
        lineHeight: `${token.mainLayout.headerHeight}px`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Typography.Title
        level={4}
        style={{ margin: 0, whiteSpace: 'nowrap' }}
      >
        {t('common.appName')}
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
            value={i18n.language}
            style={{ width: 128 }}
            onChange={(value) => i18n.changeLanguage(value)}
            options={languageOptions}
          />
        )}

        <Select
          value={themeMode}
          style={{ width: 150 }}
          onChange={(value) => setMode(value)}
          options={[
            {
              value: 'light',
              label: (
                <>
                  <SunOutlined /> {t('common.lightTheme')}
                </>
              ),
            },
            {
              value: 'dark',
              label: (
                <>
                  <MoonOutlined /> {t('common.darkTheme')}
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
              {t('nav.logout')}
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
}
