import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Result, Button } from 'antd';
import { I18nContext } from '@/i18n';

interface IProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface IState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<IProps, IState> {
  static contextType = I18nContext;
  declare context: React.ContextType<typeof I18nContext>;

  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): IState {
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
