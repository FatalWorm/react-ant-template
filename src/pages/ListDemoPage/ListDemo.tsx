import { useMemo } from 'react';
import { Table, Tag, Typography } from 'antd';
import { DateTime } from 'luxon';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/i18n';
import type { TTranslations } from '@/i18n';

const { Title, Paragraph } = Typography;

interface IRowData {
  id: number;
  name: string;
  email: string;
  date: string;
  status: 'active' | 'inactive' | 'pending';
}

const STATUSES: IRowData['status'][] = ['active', 'inactive', 'pending'];
const NAMES = [
  'Алексей',
  'Мария',
  'Иван',
  'Елена',
  'Дмитрий',
  'Ольга',
  'Сергей',
  'Анна',
];
const DOMAINS = ['mail.ru', 'yandex.ru', 'gmail.com', 'outlook.com'];

function generateData(count: number): IRowData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length],
    email: `${NAMES[i % NAMES.length].toLowerCase()}${i}@${DOMAINS[i % DOMAINS.length]}`,
    date: DateTime.now()
      .minus({ days: Math.floor(Math.random() * 365) })
      .setLocale('ru')
      .toFormat('dd MMM yyyy'),
    status: STATUSES[i % STATUSES.length],
  }));
}

const ITEM_COUNT = 10_000;

function getStatusLabel(
  status: IRowData['status'],
  t: TTranslations,
): string {
  switch (status) {
    case 'active':
      return t.listDemo.statusActive;
    case 'pending':
      return t.listDemo.statusPending;
    case 'inactive':
      return t.listDemo.statusInactive;
  }
}

function ListDemo() {
  const { t } = useTranslation();
  const data = useMemo(() => generateData(ITEM_COUNT), []);

  const columns: ColumnsType<IRowData> = useMemo(
    () => [
      { title: t.listDemo.colId, dataIndex: 'id', width: 80 },
      { title: t.listDemo.colName, dataIndex: 'name', width: 150 },
      { title: t.listDemo.colEmail, dataIndex: 'email', ellipsis: true },
      { title: t.listDemo.colDate, dataIndex: 'date', width: 140 },
      {
        title: t.listDemo.colStatus,
        dataIndex: 'status',
        width: 120,
        render: (status: IRowData['status']) => {
          const colorMap: Record<IRowData['status'], string> = {
            active: 'green',
            pending: 'orange',
            inactive: 'red',
          };
          return (
            <Tag color={colorMap[status]}>
              {getStatusLabel(status, t)}
            </Tag>
          );
        },
      },
    ],
    [t],
  );

  return (
    <div>
      <Title level={2}>{t.listDemo.title}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {t.listDemo.subtitle.replace(
          '{count}',
          ITEM_COUNT.toLocaleString('ru'),
        )}
      </Paragraph>

      <Table<IRowData>
        dataSource={data}
        columns={columns}
        rowKey="id"
        virtual
        scroll={{ y: 500 }}
        pagination={false}
      />
    </div>
  );
}

export default ListDemo;
