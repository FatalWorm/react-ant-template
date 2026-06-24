import { Button, Result } from 'antd';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { I18nContext } from '@/shared/i18n/i18n.context';

type TProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type TState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<TProps, TState> {
  static contextType = I18nContext;
  declare context: React.ContextType<typeof I18nContext>;

  constructor(props: TProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): TState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const t = this.context?.t;

      return (
        <Result
          status="error"
          title={t?.errors.somethingWentWrong ?? 'Что-то пошло не так'}
          subTitle={this.state.error?.message ?? t?.errors.unexpectedError ?? 'Произошла непредвиденная ошибка'}
          extra={
            <Button
              type="primary"
              onClick={this.handleReset}
            >
              {t?.errors.tryAgain ?? 'Попробовать снова'}
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}
