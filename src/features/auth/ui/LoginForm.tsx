/**
 * @module LoginForm
 * @description Форма авторизации: email + пароль, react-hook-form + Zod, интеграция с useAuthStore.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/entities/user';
import { useAppTranslation } from '@/shared/i18n';

import { createLoginSchema, type TLoginForm } from '../model/loginForm.schema';

const { Title, Text } = Typography;

function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const { t } = useAppTranslation();
  const schema = useMemo(() => createLoginSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: TLoginForm) => {
    try {
      clearError();
      await login(data);
      navigate('/', { replace: true });
    } catch {
      // Ошибка уже в сторе
    }
  };

  return (
    <Card style={{ width: '100%', maxWidth: 420 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>{t('common.appName')}</Title>
        <Text type="secondary">{t('auth.loginTitle')}</Text>
      </div>

      {error && (
        <Alert
          title={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Form.Item
              label={t('auth.email')}
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email?.message}
            >
              <Input
                {...field}
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
              />
            </Form.Item>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Form.Item
              label={t('auth.password')}
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password?.message}
            >
              <Input.Password
                {...field}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete="current-password"
              />
            </Form.Item>
          )}
        />

        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          block
        >
          {t('auth.loginButton')}
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text type="secondary">
          {t('auth.noAccount')} <Link to="/register">{t('auth.registerLink')}</Link>
        </Text>
      </div>
    </Card>
  );
}

export default LoginForm;
