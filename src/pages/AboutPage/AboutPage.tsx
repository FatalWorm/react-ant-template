import { Typography, Card, Space, Flex } from 'antd';
import { useTranslation } from '@/i18n';

const { Title, Paragraph, Text } = Typography;

function AboutPage() {
  const { t } = useTranslation();

  const techStack = [
    { name: 'React 19', desc: t.about.react },
    { name: 'TypeScript', desc: t.about.typescript },
    { name: 'Vite', desc: t.about.vite },
    { name: 'Vitest', desc: t.about.vitest },
    { name: 'ESLint + Prettier', desc: t.about.eslint },
    { name: 'Zustand + Immer', desc: t.about.zustand },
    { name: 'Ant Design', desc: t.about.styledComponents },
    { name: 'React Router', desc: t.about.reactRouter },
  ];

  return (
    <Flex
      justify="center"
      align="center"
      orientation="vertical"
    >
      <Title level={2}>{t.about.title}</Title>
      <Paragraph
        type="secondary"
        style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}
      >
        {t.about.description}
      </Paragraph>

      <Title level={3}>{t.about.includedTitle}</Title>
      <Space
        orientation="vertical"
        style={{ width: '100%' }}
        size="small"
      >
        {techStack.map((item) => (
          <Card
            key={item.name}
            size="small"
          >
            <Text strong>{item.name}</Text>
            <br />
            <Text type="secondary">{item.desc}</Text>
          </Card>
        ))}
      </Space>
    </Flex>
  );
}

export default AboutPage;
