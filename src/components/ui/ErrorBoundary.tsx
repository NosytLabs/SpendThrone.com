import React, { Component, ErrorInfo, ReactNode } from 'react';
import { cn } from '@/shared/utils/utils';
import { logError } from '@/shared/utils/logger';
import { Button } from './Button';
import { RoyalIcon } from './RoyalIcon';
import { Card } from './Card';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  className?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetOnPropsChange && this.state.hasError) {
      const hasResetKeyChanged = this.props.resetKeys?.some(
        (key, index) => prevProps.resetKeys?.[index] !== key
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 0);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} resetError={this.resetErrorBoundary} className={this.props.className} />;
    }

    return this.props.children;
  }
}

export interface ErrorFallbackProps {
  error: Error | null;
  resetError?: () => void;
  className?: string;
  title?: string;
  message?: string;
  showDetails?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  className,
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  showDetails = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4', className)}>
      <Card variant="glass" className="max-w-2xl w-full">
        <div className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-error/20 p-4 rounded-full">
              <RoyalIcon
                variant="error"
                size={48}
                className="text-error"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">
              {title}
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              {message}
            </p>
          </div>

          {showDetails && error && (
            <div className="bg-background-secondary rounded-lg p-4 text-left">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>Error Details</span>
                <RoyalIcon
                  variant={isExpanded ? 'chevronUp' : 'chevronDown'}
                  size={16}
                />
              </button>
              
              {isExpanded && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-text-muted font-mono bg-background-primary p-3 rounded border">
                    <div className="font-semibold text-text-secondary mb-1">Error Message:</div>
                    <div>{error.message}</div>
                  </div>
                  {error.stack && (
                    <div className="text-xs text-text-muted font-mono bg-background-primary p-3 rounded border max-h-32 overflow-y-auto">
                      <div className="font-semibold text-text-secondary mb-1">Stack Trace:</div>
                      <div>{error.stack}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {resetError && (
              <Button
                onClick={resetError}
                variant="primary"
                className="min-w-[120px]"
              >
                <RoyalIcon variant="refresh" className="mr-2" />
                Try Again
              </Button>
            )}
            
            <Button
              onClick={handleReload}
              variant="outline"
              className="min-w-[120px]"
            >
              <RoyalIcon variant="refresh" className="mr-2" />
              Reload Page
            </Button>
            
            <Button
              onClick={handleGoHome}
              variant="ghost"
              className="min-w-[120px]"
            >
              <RoyalIcon variant="home" className="mr-2" />
              Go Home
            </Button>
          </div>

          <div className="text-xs text-text-muted pt-4 border-t border-border-primary">
            <p>If the problem persists, please contact support with the error details above.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorBoundary;