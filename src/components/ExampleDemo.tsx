import { Button, Input, List, message,Spin, Typography } from 'antd';
import { useState } from 'react';

import { useCreateExampleItem, useExampleItems } from '@/hooks/useExample';

const { Title } = Typography;

/**
 * Компонент представления.
 * Ничего не знает об API или репозиториях напрямую, 
 * работает исключительно через кастомные хуки.
 */
export function ExampleDemo() {
  const [inputValue, setInputValue] = useState('');
  
  // Использование хуков
  const { items, isLoading, isError } = useExampleItems();
  const { mutate: createItem, isPending: isCreating } = useCreateExampleItem();

  const handleCreate = () => {
    if (!inputValue.trim()) return;
    
    createItem(inputValue, {
      onSuccess: () => {
        message.success('Элемент успешно создан!');
        setInputValue('');
      },
      onError: () => {
        message.error('Ошибка при создании элемента');
      }
    });
  };

  if (isError) {
    return <Typography.Text type="danger">Ошибка загрузки данных</Typography.Text>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Title level={3}>Демонстрация Архитектуры</Title>
      <Typography.Paragraph type="secondary">
        Component {'->'} useHook {'->'} Repository {'->'} API
      </Typography.Paragraph>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введите название элемента..."
          onPressEnter={handleCreate}
          disabled={isCreating}
        />
        <Button 
          type="primary" 
          onClick={handleCreate} 
          loading={isCreating}
        >
          Создать
        </Button>
      </div>

      <Spin spinning={isLoading}>
        <List
          bordered
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.title}</Typography.Text>
              <Typography.Text type="secondary" style={{ marginLeft: 'auto' }}>
                {item.completed ? '✅ Выполнено' : '⏳ В ожидании'}
              </Typography.Text>
            </List.Item>
          )}
          locale={{ emptyText: 'Нет данных' }}
        />
      </Spin>
    </div>
  );
}
