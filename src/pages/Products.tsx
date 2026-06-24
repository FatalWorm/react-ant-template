/**
 * @module ProductsPage
 * @description Страница «Товары» — эталонный пример CRUD-страницы.
 * Демонстрирует работу useApiQuery, useApiMutation, ApiError и API_ERROR_CODES.
 */

import { App, Button, Input, InputNumber, Popconfirm, Space, Table, Typography } from 'antd';
import { useState } from 'react';

import type { TCreateProduct, TProduct } from '@/entities/product';
import { productApi, productKeys } from '@/entities/product';
import type { ApiResponse } from '@/shared/api';
import { ApiError } from '@/shared/api';
import { API_ERROR_CODES } from '@/shared/api';
import { useApiMutation } from '@/shared/lib/hooks';
import { useApiQuery } from '@/shared/lib/hooks';
import { PageWrapper } from '@/shared/ui';

const { Title } = Typography;

function ProductsPage() {
  const { message } = App.useApp();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);

  /** Запрос списка товаров */
  const { data: response, isLoading } = useApiQuery<ApiResponse<TProduct[]>>(productKeys.lists(), (signal) =>
    productApi.getAll(signal),
  );
  const products = response?.data;

  /** Мутация: создание товара */
  const { mutate: createProduct, isPending: isCreating } = useApiMutation<ApiResponse<TProduct>, TCreateProduct>(
    (data) => productApi.create(data),
    {
      invalidateKeys: [productKeys.lists()],
      onSuccess: () => {
        message.success('Товар создан');
        setName('');
        setPrice(0);
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          if (err.is(API_ERROR_CODES.validation.INVALID_INPUT)) {
            message.error('Проверьте введённые данные');
          } else if (err.is(API_ERROR_CODES.resource.ALREADY_EXISTS)) {
            message.error('Товар с таким именем уже существует');
          } else {
            message.error(err.message);
          }
        }
      },
    },
  );

  /** Мутация: удаление товара */
  const { mutate: deleteProduct } = useApiMutation<void, string>((id) => productApi.delete(id), {
    invalidateKeys: [productKeys.lists()],
    onSuccess: () => message.success('Товар удалён'),
  });

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (val: number) => `${val.toLocaleString('ru-RU')} ₽`,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: TProduct) => (
        <Popconfirm
          title="Удалить товар?"
          onConfirm={() => deleteProduct(record.id)}
        >
          <Button
            danger
            size="small"
          >
            Удалить
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleCreate = () => {
    if (!name.trim() || price <= 0) return;
    createProduct({ name: name.trim(), price });
  };

  return (
    <PageWrapper>
      <Title level={2}>Товары</Title>

      <Space style={{ marginBottom: 24 }}>
        <Input
          placeholder="Название товара"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 200 }}
        />
        <InputNumber
          placeholder="Цена"
          value={price}
          onChange={(v) => setPrice(v ?? 0)}
          min={0}
          style={{ width: 120 }}
          addonAfter="₽"
        />
        <Button
          type="primary"
          onClick={handleCreate}
          loading={isCreating}
        >
          Добавить
        </Button>
      </Space>

      <Table<TProduct>
        dataSource={products ?? []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </PageWrapper>
  );
}

export default ProductsPage;
