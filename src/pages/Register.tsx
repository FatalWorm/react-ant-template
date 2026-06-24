import RegisterForm from '@/features/auth/ui/RegisterForm';
import { PageWrapper } from '@/shared/ui/PageWrapper';

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
