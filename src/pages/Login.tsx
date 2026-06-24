/**
 * @module LoginPage
 * @description Страница входа — обёртка над LoginForm с центрированным layout.
 */

import { LoginForm } from '@/features/auth';
import { PageWrapper } from '@/shared/ui';

export default function LoginPage() {
  return (
    <PageWrapper
      justify="center"
      align="center"
      style={{ minHeight: '100vh' }}
    >
      <LoginForm />
    </PageWrapper>
  );
}
