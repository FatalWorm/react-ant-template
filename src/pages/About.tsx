/**
 * @module AboutPage
 * @description Страница «О проекте» — обзор технологий и архитектуры шаблона.
 */

import { Card, Table, theme, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useTranslation } from '@/shared/i18n';
import { PageWrapper } from '@/shared/ui';

import packageJson from '../../package.json';

const { Title, Paragraph } = Typography;

type TDependency = {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency';
};

function AboutPage() {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const dependencies: TDependency[] = Object.entries(packageJson.dependencies || {}).map(([name, version]) => ({
    name,
    version: version as string,
    type: 'dependency',
  }));

  const devDependencies: TDependency[] = Object.entries(packageJson.devDependencies || {}).map(([name, version]) => ({
    name,
    version: version as string,
    type: 'devDependency',
  }));

  const allDependencies = [...dependencies, ...devDependencies].sort((a, b) => a.name.localeCompare(b.name));

  const columns: ColumnsType<TDependency> = [
    {
      title: t('techStack.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: t('techStack.version'),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: t('techStack.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span style={{ color: type === 'dependency' ? token.colorPrimary : token.colorSuccess }}>
          {type === 'dependency' ? 'Production' : 'Development'}
        </span>
      ),
      filters: [
        { text: 'Production', value: 'dependency' },
        { text: 'Development', value: 'devDependency' },
      ],
      onFilter: (value, record) => record.type === value,
    },
  ];

  return (
    <PageWrapper
      maxWidth={1000}
      style={{
        margin: '0 auto',
        height: `calc(100vh - ${token.mainLayout.headerHeight + token.mainLayout.footerHeight + token.mainLayout.contentPadding * 2}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Title level={2}>{t('techStack.title')}</Title>
      <Paragraph
        type="secondary"
        style={{ fontSize: 16, marginBottom: 32 }}
      >
        {t('techStack.description')}
      </Paragraph>

      <Card
        styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <Table
          columns={columns}
          dataSource={allDependencies}
          rowKey="name"
          pagination={false}
          size="middle"
          scroll={{
            y: `calc(100vh - ${token.mainLayout.headerHeight + token.mainLayout.footerHeight + token.mainLayout.contentPadding * 2 + 240}px)`,
          }}
          style={{ flex: 1 }}
        />
      </Card>
    </PageWrapper>
  );
}

export default AboutPage;
