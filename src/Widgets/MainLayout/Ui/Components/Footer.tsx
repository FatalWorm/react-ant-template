/**
 * @module LayoutFooter
 * @description Подвал приложения с копирайтом и локализацией.
 */

import { Layout, theme, Typography } from 'antd';

import { useAppTranslation } from '@/Shared/I18n';

const { Footer } = Layout;

export function LayoutFooter() {
  const { t } = useAppTranslation();
  const { token } = theme.useToken();

  return (
    <Footer
      style={{
        textAlign: 'center',
        height: token.mainLayout.footerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <Typography.Text type="secondary">{t('common.copyright')}</Typography.Text>
    </Footer>
  );
}
