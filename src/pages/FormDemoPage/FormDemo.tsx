import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Form, Input, Select, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { PageWrapper } from '@/components/PageWrapper';
import { useTranslation } from '@/i18n/useTranslation';

import {
  createFormDemoSchema,
  type TFormDemoData,
} from './formDemo.schema';

const { Title, Paragraph } = Typography;

function FormDemo() {
  const [submitted, setSubmitted] = useState<TFormDemoData | null>(null);
  const { t } = useTranslation();
  const schema = useMemo(() => createFormDemoSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TFormDemoData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '', priority: 'medium' },
  });

  const onSubmit = async (data: TFormDemoData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(data);
    reset();
  };

  return (
    <PageWrapper maxWidth={600}>
      <Title level={2}>{t.formDemo.title}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t.formDemo.subtitle}
      </Paragraph>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={t.formDemo.nameLabel}
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Input
                  {...field}
                  placeholder={t.formDemo.namePlaceholder}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={t.formDemo.emailLabel}
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Input
                  {...field}
                  type="email"
                  placeholder={t.formDemo.emailPlaceholder}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={t.formDemo.priorityLabel}
                validateStatus={errors.priority ? 'error' : ''}
                help={errors.priority?.message}
              >
                <Select
                  {...field}
                  options={[
                    { value: 'low', label: t.formDemo.priorityLow },
                    { value: 'medium', label: t.formDemo.priorityMedium },
                    { value: 'high', label: t.formDemo.priorityHigh },
                  ]}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={t.formDemo.messageLabel}
                validateStatus={errors.message ? 'error' : ''}
                help={errors.message?.message}
              >
                <Input.TextArea
                  {...field}
                  rows={4}
                  placeholder={t.formDemo.messagePlaceholder}
                />
              </Form.Item>
            )}
          />

          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            {t.formDemo.submitButton}
          </Button>
        </form>
      </Card>

      {submitted && (
        <Alert
          type="success"
          title={t.formDemo.successTitle}
          description={
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(submitted, null, 2)}
            </pre>
          }
          style={{ marginTop: 24 }}
          showIcon
        />
      )}
    </PageWrapper>
  );
}

export default FormDemo;
