import { Spin, type SpinProps } from 'antd';

import { useTranslation } from '@/shared/i18n/useTranslation';
import { PageWrapper, type TPageWrapperProps } from '@/shared/ui/PageWrapper';

export type TLoadingFallbackProps = {
  spin?: SpinProps;
  wrapper?: Omit<TPageWrapperProps, 'children'>;
};

export function LoadingFallback({ spin, wrapper }: TLoadingFallbackProps) {
  const { t } = useTranslation();

  return (
    <PageWrapper {...wrapper}>
      <Spin
        fullscreen
        size="large"
        tip={t.common.loading}
        {...spin}
      />
    </PageWrapper>
  );
}
