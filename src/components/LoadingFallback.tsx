import { Spin } from 'antd';
import { useTranslation } from '@/i18n';

export function LoadingFallback() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
      }}
    >
      <Spin size="large" tip={t.common.loading}>
        {/* Spin with tip requires a child element */}
        <div style={{ padding: 50 }} />
      </Spin>
    </div>
  );
}
