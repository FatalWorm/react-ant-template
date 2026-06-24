/**
 * @module ErrorBoundary
 * @description React Error Boundary — перехватчик необработанных ошибок рендеринга.
 * Разделён на тонкий class-wrapper (React API) и функциональный ErrorFallback (UI с i18n).
 */

import { Button, Result } from 'antd';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { useTranslation } from '@/shared/i18n';

// ─── Fallback UI (функциональный компонент с хуком) ──────────────────────────

type TFallbackProps = {
  error: Error;
  onReset: () => void;
};

export function ErrorFallback({ error, onReset }: TFallbackProps) {
  const { t } = useTranslation();

  return (
    <Result
      status="error"
      title={t('errors.somethingWentWrong')}
      subTitle={error.message ?? t('errors.unexpectedError')}
      extra={
        <Button
          type="primary"
          onClick={onReset}
        >
          {t('errors.tryAgain')}
        </Button>
      }
    />
  );
}

// ─── Error Boundary (тонкий class-wrapper, без UI-логики) ────────────────────

type TProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type TState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<TProps, TState> {
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
      return (
        this.props.fallback ?? (
          <ErrorFallback
            error={this.state.error!}
            onReset={this.handleReset}
          />
        )
      );
    }

    return this.props.children;
  }
}
