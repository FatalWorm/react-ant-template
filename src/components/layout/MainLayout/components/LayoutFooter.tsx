import { Layout, Typography } from 'antd';

import { useTranslation } from '@/i18n/useTranslation';

const { Footer } = Layout;

export function LayoutFooter() {
  const { t } = useTranslation();

  return (
    <Footer style={{ textAlign: 'center' }}>
      <Typography.Text type="secondary">{t.common.copyright}</Typography.Text>
    </Footer>
  );
}
