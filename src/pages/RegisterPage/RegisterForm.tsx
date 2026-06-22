import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography } from 'antd';
import { useAuthStore } from '@/store';
import { useTranslation } from '@/i18n';
import {
  createRegisterSchema,
  type TRegisterForm,
} from './registerForm.schema';

const { Title, Text } = Typography;

function RegisterForm() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const { t } = useTranslation();
  const schema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', passwordConfirm: '' },
  });

  const onSubmit = async (data: TRegisterForm) => {
    try {
      clearError();
      await registerUser(data);
      navigate('/', { replace: true });
    } catch {
      // Ошибка уже в сторе
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>{t.common.appName}</Title>
          <Text type="secondary">{t.auth.registerTitle}</Text>
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
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={t.auth.name}
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Input
                  {...field}
                  placeholder={t.auth.namePlaceholder}
                  autoComplete="name"
                />
              </Form.Item>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={t.auth.email}
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Input
                  {...field}
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
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
                label={t.auth.password}
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
              >
                <Input.Password
                  {...field}
                  placeholder={t.auth.passwordPlaceholder}
                  autoComplete="new-password"
                />
              </Form.Item>
            )}
          />

          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={t.auth.passwordConfirm}
                validateStatus={errors.passwordConfirm ? 'error' : ''}
                help={errors.passwordConfirm?.message}
              >
                <Input.Password
                  {...field}
                  placeholder={t.auth.passwordPlaceholder}
                  autoComplete="new-password"
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
            {t.auth.registerButton}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">
            {t.auth.hasAccount}{' '}
            <Link to="/login">{t.auth.loginLink}</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default RegisterForm;
