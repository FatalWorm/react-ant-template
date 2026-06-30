/**
 * @module LoginPage
 * @description Страница входа — обёртка над LoginForm с центрированным layout.
 */

import { LoginForm } from '@/Features/Auth';

import { PageWrapper } from '@/Shared/Ui';

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
