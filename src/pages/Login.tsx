import LoginForm from '@/features/auth/ui/LoginForm';
import { PageWrapper } from '@/shared/ui/PageWrapper';

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
