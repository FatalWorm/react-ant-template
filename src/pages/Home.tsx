/**
 * @module HomePage
 * @description Главная страница с информационными карточками и демонстрацией функционала.
 */

import { Card, Col, Row, Tag, theme, Typography } from 'antd';
import { DateTime } from 'luxon';

import { useAppTranslation } from '@/shared/i18n';
import { PageWrapper } from '@/shared/ui';

const { Title, Paragraph, Text } = Typography;

function HomePage() {
  const { t, i18n } = useAppTranslation();
  const { token } = theme.useToken();
  const now = DateTime.now().setLocale(i18n.language).toFormat('dd MMMM yyyy, HH:mm');

  const features = [
    {
      key: 'zustand',
      icon: '🧩',
      title: t('home.features.zustandTitle'),
      desc: t('home.features.zustandDesc'),
    },
    {
      key: 'rhf',
      icon: '📝',
      title: t('home.features.rhfTitle'),
      desc: t('home.features.rhfDesc'),
    },
    {
      key: 'sc',
      icon: '🎨',
      title: t('home.features.scTitle'),
      desc: t('home.features.scDesc'),
    },
    {
      key: 'rw',
      icon: '📋',
      title: t('home.features.rwTitle'),
      desc: t('home.features.rwDesc'),
    },
    {
      key: 'ky',
      icon: '🌐',
      title: t('home.features.kyTitle'),
      desc: t('home.features.kyDesc'),
    },
    {
      key: 'vitest',
      icon: '🧪',
      title: t('home.features.vitestTitle'),
      desc: t('home.features.vitestDesc'),
    },
  ];

  return (
    <PageWrapper>
      <div style={{ textAlign: 'center', padding: '64px 0 48px' }}>
        <Tag
          color="blue"
          style={{ marginBottom: 16, fontSize: 14 }}
        >
          {t('home.badge')}
        </Tag>
        <Title
          style={{
            background: `linear-gradient(135deg, ${token.colorPrimary}, #8b5cf6)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('home.title')}
        </Title>
        <Paragraph
          type="secondary"
          style={{ fontSize: 18, maxWidth: 600, margin: '0 auto 16px' }}
        >
          {t('home.subtitle')}
        </Paragraph>
        <Text code>
          {t('home.now')}: {now}
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {features.map((f) => (
          <Col
            xs={24}
            sm={12}
            lg={8}
            key={f.key}
          >
            <Card
              hoverable
              style={{ height: '100%' }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
              <Title level={4}>{f.title}</Title>
              <Paragraph type="secondary">{f.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </PageWrapper>
  );
}

export default HomePage;
