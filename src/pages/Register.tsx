/**
 * @module RegisterPage
 * @description Страница регистрации — обёртка над RegisterForm с центрированным layout.
 */

import { RegisterForm } from '@/Features/Auth';

import { PageWrapper } from '@/Shared/Ui';

export default function RegisterPage() {
  return (
    <PageWrapper
      justify="center"
      align="center"
      style={{ minHeight: '100vh' }}
    >
      <RegisterForm />
    </PageWrapper>
  );
}
