import { Spin, type SpinProps } from 'antd';

import { PageWrapper, type TPageWrapperProps } from '@/components/PageWrapper';
import { useTranslation } from '@/i18n/useTranslation';

export type TLoadingFallbackProps = {
  spin?: SpinProps;
  wrapper?: Omit<TPageWrapperProps, 'children'>;
};

export function LoadingFallback({ spin, wrapper }: TLoadingFallbackProps) {
  const { t } = useTranslation();

  return (<PageWrapper {...wrapper}>
    <Spin fullscreen size="large" tip={t.common.loading} {...spin} />
  </PageWrapper>);
}
