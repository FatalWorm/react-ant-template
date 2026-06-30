/**
 * @module LoadingFallback
 * @description Компонент полноэкранного лоадера для Suspense fallback и отложенной загрузки.
 */

import { Spin, type SpinProps } from 'antd';

import { useAppTranslation } from '@/Shared/I18n';
import { PageWrapper, type TPageWrapperProps } from '@/Shared/Ui';

export type TLoadingFallbackProps = {
  spin?: SpinProps;
  wrapper?: Omit<TPageWrapperProps, 'children'>;
};

export function LoadingFallback({ spin, wrapper }: TLoadingFallbackProps) {
  const { t } = useAppTranslation();

  return (
    <PageWrapper {...wrapper}>
      <Spin
        fullscreen
        size="large"
        description={t('common.loading')}
        {...spin}
      />
    </PageWrapper>
  );
}
