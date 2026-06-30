/**
 * @module ProductsPage
 * @description Страница «Товары» — эталонный пример CRUD-страницы.
 * Демонстрирует работу useApiQuery, useApiMutation, ApiError и API_ERROR_CODES.
 */

import { useState } from 'react';
import { App, Button, Input, InputNumber, Popconfirm, Space, Table, Typography } from 'antd';

import type { TCreateProduct, TProduct } from '@/Entities/Product';
import { ProductApi, productKeys } from '@/Entities/Product';

import type { ApiResponse } from '@/Shared/Api';
import { ApiError } from '@/Shared/Api';
import { API_ERROR_CODES } from '@/Shared/Api';
import { useApiMutation } from '@/Shared/Lib/Hooks';
import { useApiQuery } from '@/Shared/Lib/Hooks';
import { PageWrapper } from '@/Shared/Ui';

const { Title } = Typography;

function ProductsPage() {
  const { message } = App.useApp();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);

  /** Запрос списка товаров */
  const { data: response, isLoading } = useApiQuery<ApiResponse<TProduct[]>>(productKeys.lists(), (signal) =>
    ProductApi.getAll(signal),
  );
  const products = response?.data;

  /** Мутация: создание товара */
  const { mutate: createProduct, isPending: isCreating } = useApiMutation<ApiResponse<TProduct>, TCreateProduct>(
    (data) => ProductApi.create(data),
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
  const { mutate: deleteProduct } = useApiMutation<void, string>((id) => ProductApi.delete(id), {
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
